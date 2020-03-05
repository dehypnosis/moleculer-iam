import { ClientMetadata, Configuration, InteractionResults } from "oidc-provider";
import { Identity } from "../../idp";
import { ProviderConfigBuilder } from "./config";
import { OIDCAccountClaims } from "./identity.types";
import { ApplicationRequestContext, ApplicationState, ApplicationResponse, ApplicationSessionState, ApplicationMetadata } from "./app.types";
import { BaseContext } from "koa";
import { Client, DeviceInfo, DiscoveryMetadata, Interaction, Session } from "./proxy.types";

// ref: https://github.com/panva/node-oidc-provider/blob/9306f66bdbcdff01400773f26539cf35951b9ce8/lib/models/client.js#L385
// @ts-ignore : need to hack oidc-provider private methods
import getProviderHiddenProps from "oidc-provider/lib/helpers/weak_cache";
// @ts-ignore : need to hack oidc-provider private methods
import sessionMiddleware from "oidc-provider/lib/shared/session";

const JSON = "application/json";
const HTML = "text/html";

export class OIDCProviderContextProxy {
  private static readonly sessionAppStateField = "__app__";
  public session: Session & { state: ApplicationSessionState } = {} as any;
  public interaction?: Interaction;
  public client?: Client;
  public clientMetadata?: Partial<ClientMetadata>;
  public user?: Identity;
  public userClaims?: Partial<OIDCAccountClaims>;
  public device?: DeviceInfo;
  public metadata: ApplicationMetadata = {} as any;

  constructor(private readonly ctx: ApplicationRequestContext, private builder: ProviderConfigBuilder) {
  }

  private get idp() {
    return this.builder.app.idp;
  }

  private get provider() {
    return this.builder.app.op;
  }

  public get getURL() {
    return this.builder.app.getURL;
  }

  public get getNamedURL() {
    return (this.provider as any).urlFor;
  }

  private get sessionAppState() {
    return this.session.state && this.session.state[OIDCProviderContextProxy.sessionAppStateField] || {};
  }

  public async setSessionState(update: (prevState: ApplicationSessionState) => ApplicationSessionState): Promise<ApplicationSessionState> {
    const { ctx, session } = this;
    const field = OIDCProviderContextProxy.sessionAppStateField;

    if (!session.state) {
      session.state = { custom: {} };
    } else if (!session.state[field]) {
      session.state[field] = {};
    }
    session.state[field] = update(session.state[field]);

    await sessionMiddleware(ctx, () => {
      // @ts-ignore to set Set-Cookie response header
      session.touched = true;
    });

    // @ts-ignore store/update session in to adapter
    await session.save();
    return session.state[field];
  }

  public async render(stateProps: Pick<ApplicationState, "name"|"actions">|Pick<ApplicationState, "name"|"error">): Promise<void> {
    const { ctx } = this;

    const state: ApplicationState = {
      name: "undefined",
      actions: {},
      ...stateProps,
      metadata: this.metadata,
      locale: ctx.locale,
      session: this.sessionAppState,
      interaction: this.interaction,

      // current op interaction information (login, consent)
      client: this.clientMetadata,
      user: this.userClaims,
      device: this.device,
    };

    if (ctx.accepts(JSON, HTML) === JSON) {
      ctx.type = JSON;
      const response: ApplicationResponse = { state };
      ctx.body = response;
      return;
    }

    ctx.type = HTML;

    // unwrap enhanced context and delegate render to secure vulnerability
    return this.builder.app.appRenderer.render(ctx.unwrap(), state);
  }

  public async redirectWithUpdate(promptUpdate: Partial<InteractionResults> | { error: string, error_description?: string }, allowedPromptNames?: string[]): Promise<void> {
    const { ctx, interaction, provider } = this;
    ctx.assert(interaction && (!allowedPromptNames || allowedPromptNames.includes(interaction.prompt.name)));

    const mergedResult = {...this.interaction!.result, ...promptUpdate};
    const redirectURL = await provider.interactionResult(ctx.req, ctx.res, mergedResult, { mergeWithLastSubmission: true });

    // overwrite session account if need
    if (mergedResult.login) {
      await provider.setProviderSession(ctx.req, ctx.res, mergedResult.login);
      await this._parseInteractionState();
    }
    return ctx.redirect(redirectURL);
  }

  public redirect(url: string): void {
    return this.ctx.redirect(url.startsWith("/") ? this.getURL(url) : url);
  };

  public end(): void {
    const response: ApplicationResponse = { session: this.setSessionState };
    this.ctx.type = JSON;
    this.ctx.body = response;
  }

  public assertPrompt(allowedPromptNames?: string[]): void {
    const { ctx, interaction } = this;
    ctx.assert(interaction && (!allowedPromptNames || allowedPromptNames.includes(interaction.prompt.name)));
  }

  // utility
  public async getPublicClientProps(client?: Client): Promise<Partial<ClientMetadata> | undefined> {
    if (!client) return;
    return {
      id: client.clientId,
      name: client.clientName,
      logo_uri: client.logoUri,
      tos_uri: client.tosUri,
      policy_uri: client.policyUri,
      client_uri: client.clientUri,
    };
  }

  public async getPublicUserProps(id?: Identity): Promise<Partial<OIDCAccountClaims> | undefined> {
    if (!id) return;
    const {email, picture, name} = await id.claims("userinfo", "profile email");
    return {
      email,
      name: name || "unknown",
      picture,
    };
  }

  public async _dangerouslyCreate() {
    const { ctx, idp, provider } = this;
    const hiddenProvider = getProviderHiddenProps(provider);

    // @ts-ignore ensure oidc context is created
    if (!ctx.oidc) {
      Object.defineProperty(ctx, "oidc", { value: new hiddenProvider.OIDCContext(ctx as any) });
    }
    const configuration: Configuration = hiddenProvider.configuration();
    this.session = await provider.Session.get(ctx as any) as any;
    this.metadata = {
      federationProviders: this.builder.app.federation.providerNames,
      mandatoryScopes: idp.claims.mandatoryScopes,
      supportedScopes: idp.claims.supportedScopes,
      discovery: configuration.discovery as DiscoveryMetadata,
    };

    await this._parseInteractionState();
    return this;
  }

  private async _parseInteractionState() {
    const { ctx, idp, provider } = this;
    try {
      const interaction = await provider.interactionDetails(ctx.req, ctx.res) as Interaction;
      this.interaction = interaction;
      this.user = interaction.session && typeof interaction.session.accountId === "string" ? (await idp.findOrFail({ id: interaction.session.accountId })) : undefined;
      if (this.user) {
        this.userClaims = await this.getPublicUserProps(this.user);
      }
      this.client = interaction.params.client_id ? (await provider.Client.find(interaction.params.client_id) as Client) : undefined;
      if (this.client) {
        this.clientMetadata = await this.getPublicClientProps(this.client);
      }
    } catch (err) {}
  }
}
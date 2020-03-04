import { ClientMetadata, Configuration, InteractionResults } from "oidc-provider";
import { Identity } from "../../idp";
import { ProviderConfigBuilder } from "./config";
import { OIDCAccountClaims } from "./identity.types";
import { InteractionRequestContext, InteractionState, InteractionResponse, SessionState, InteractionMetadata } from "./interaction.types";
import { Client, DiscoveryMetadata, Interaction, Session } from "./proxy.types";

// ref: https://github.com/panva/node-oidc-provider/blob/9306f66bdbcdff01400773f26539cf35951b9ce8/lib/models/client.js#L385
// @ts-ignore : need to hack oidc-provider private methods
import getProviderHiddenProps from "oidc-provider/lib/helpers/weak_cache";
// @ts-ignore : need to hack oidc-provider private methods
import sessionMiddleware from "oidc-provider/lib/shared/session";

const JSON = "application/json";
const HTML = "text/html";

export class OIDCProviderContextProxy {
  public session: Session & { state: SessionState } = {} as any;
  public interaction?: Interaction;
  public client?: Client;
  public user?: Identity;
  public metadata: InteractionMetadata = {} as any;

  constructor(private readonly ctx: InteractionRequestContext, private builder: ProviderConfigBuilder) {
  }

  private get idp() {
    return this.builder.interaction.idp;
  }

  private get provider() {
    return this.builder.interaction.op;
  }

  public get getURL() {
    return this.builder.interaction.getURL;
  }

  public get getNamedURL() {
    return (this.provider as any).urlFor;
  }

  public async render(stateProps: Partial<InteractionState>): Promise<void> {
    const { ctx } = this;

    const state: InteractionState = {
      name: "undefined",
      actions: {},
      ...stateProps,
      metadata: this.metadata,
      session: this.session.state && this.session.state.custom || {},
    };

    if (ctx.accepts(JSON, HTML) === JSON) {
      ctx.type = JSON;
      const response: InteractionResponse = { state };
      ctx.body = response;
      return;
    }

    ctx.type = HTML;
    return this.builder.interaction.stateRenderer.render(ctx, state);
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
    const { ctx, session } = this;
    const response: InteractionResponse = { session: session.state && session.state.custom || {} };
    ctx.type = JSON;
    ctx.body = response;
  }

  public assertPrompt(allowedPromptNames?: string[]): void {
    const { ctx, interaction } = this;
    ctx.assert(interaction && (!allowedPromptNames || allowedPromptNames.includes(interaction.prompt.name)));
  }

  public async setSessionState(update: (prevState: SessionState) => SessionState): Promise<SessionState> {
    const { ctx, session } = this;

    if (!session.state) {
      session.state = { custom: {} };
    } else if (!session.state.custom) {
      session.state.custom = {};
    }
    session.state.custom = update(session.state.custom);

    await sessionMiddleware(ctx, () => {
      // @ts-ignore to set Set-Cookie response header
      session.touched = true;
    });

    // @ts-ignore store/update session in to adapter
    await session.save();
    return session.state.custom;
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
      availableFederationProviders: this.builder.interaction.federation.providerNames,
      // availableScopes: await this.idp.claims.getActiveClaimsSchemata()
      //   .then(schemata =>
      //     schemata.reduce((scopes, schema) => {
      //       scopes[schema.scope] = scopes[schema.scope] || {};
      //       scopes[schema.scope][schema.key] = schema.validation;
      //       return scopes;
      //     }, {} as any)
      //   ),
      mandatoryScopes: idp.claims.mandatoryScopes,
      locale: ctx.locale,
      discovery: configuration.discovery as DiscoveryMetadata,
      xsrf: this.session.state && this.session.state.secret || undefined,
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
        this.metadata.user = await this.getPublicUserProps(this.user);
      }
      this.client = interaction.params.client_id ? (await provider.Client.find(interaction.params.client_id) as Client) : undefined;
      if (this.client) {
        this.metadata.client = await this.getPublicClientProps(this.client);
      }
    } catch (err) {}
  }
}

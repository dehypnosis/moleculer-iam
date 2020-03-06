import { ClientMetadata, Configuration, InteractionResults } from "oidc-provider";
import { Identity } from "../../idp";
import { ProviderConfigBuilder } from "./config";
import { OIDCError } from "./error.types";
import { OIDCAccountClaims } from "./identity.types";
import { ApplicationRequestContext, ApplicationState, ApplicationResponse, ApplicationSessionPublicState, ApplicationMetadata, ApplicationRoutes, ApplicationSessionSecretState } from "./app.types";
import { Client, DeviceInfo, DiscoveryMetadata, Interaction, Session } from "./proxy.types";

// need to hack oidc-provider private methods
// ref: https://github.com/panva/node-oidc-provider/blob/9306f66bdbcdff01400773f26539cf35951b9ce8/lib/models/client.js#L385
// @ts-ignore
import getProviderHiddenProps from "oidc-provider/lib/helpers/weak_cache";
// @ts-ignore
import sessionMiddleware from "oidc-provider/lib/shared/session";

const JSON = "application/json";
const HTML = "text/html";
const PUBLIC = "__public__";
const SECRET = "__secret__";

export class OIDCProviderContextProxy {
  public session: Session = {} as any; // filled later
  public metadata: ApplicationMetadata = {} as any; // filled later
  public interaction?: Interaction;
  public client?: Client;
  public clientMetadata?: Partial<ClientMetadata>;
  public user?: Identity;
  public userClaims?: Partial<OIDCAccountClaims>;
  public device?: DeviceInfo;

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

  public get routes() {
    return this.builder.app.getRoutes(this.interaction && this.interaction.prompt && this.interaction.prompt.name);
  }

  // response methods
  public async render(name: string, error?: OIDCError, additionalRoutes?: ApplicationRoutes): Promise<void> {
    await this.ensureSessionSaved();

    const { ctx } = this;

    // response { error: {} } when is XHR and stateProps has error
    if (this.isXHR && error) {
      const response: ApplicationResponse = { error };
      ctx.type = JSON;
      ctx.body = response;
      return;
    }

    // else response { state: {...} }
    const state: ApplicationState = {
      name,
      error,
      routes: {
        ...this.routes,
        ...additionalRoutes,
      },
      metadata: this.metadata,
      locale: ctx.locale,
      session: this.sessionPublicState,
      interaction: this.interaction,

      // current op interaction information (login, consent)
      client: this.clientMetadata,
      user: this.userClaims,
      device: this.device,
    };

    if (this.isXHR) {
      const response: ApplicationResponse = { state };
      ctx.type = JSON;
      ctx.body = response;
      return;
    }

    // unwrap enhanced context to secure vulnerability, then delegate response to app renderer
    ctx.type = HTML;
    return this.builder.app.appRenderer.render(ctx.unwrap(), state);
  }

  public async redirectWithUpdate(promptUpdate: Partial<InteractionResults> | { error: string, error_description?: string }, allowedPromptNames?: string[]): Promise<void> {
    await this.ensureSessionSaved();

    // finish interaction prompt
    const { ctx, interaction, provider } = this;
    ctx.assert(interaction && (!allowedPromptNames || allowedPromptNames.includes(interaction.prompt.name)));

    const mergedResult = {...this.interaction!.result, ...promptUpdate};
    const redirectURL = await provider.interactionResult(ctx.req, ctx.res, mergedResult, { mergeWithLastSubmission: true });

    // overwrite session account if need and re-parse interaction state
    if (mergedResult.login) {
      await provider.setProviderSession(ctx.req, ctx.res, mergedResult.login);
      await this.readProviderSession();
    }

    return this.redirect(redirectURL);
  }

  public async redirect(url: string): Promise<void> {
    await this.ensureSessionSaved();

    const redirectURL = url.startsWith("/") ? this.getURL(url) : url; // add prefix for local redirection
    if (this.isXHR) {
      const response: ApplicationResponse = { redirect: redirectURL };
      this.ctx.body = response;
      return;
    }

    this.ctx.redirect(redirectURL);
  }

  public async end(): Promise<void> {
    await this.ensureSessionSaved();

    const response: ApplicationResponse = { session: this.sessionPublicState };
    this.ctx.type = JSON;
    this.ctx.body = response;
  }

  // session management
  public get sessionPublicState() {
    return this.session.state && this.session.state[PUBLIC] || {};
  }

  public get sessionSecretState() {
    return this.session.state && this.session.state[SECRET] || {};
  }

  public async setSessionPublicState(update: (prevPublicState: ApplicationSessionPublicState) => ApplicationSessionPublicState): Promise<void> {
    return this.setSessionState(prevState => ({
      ...prevState,
      [PUBLIC]: update(prevState[PUBLIC] || {}),
    }))
  }

  public async setSessionSecretState(update: (prevSecretState: ApplicationSessionSecretState) => ApplicationSessionSecretState): Promise<void> {
    return this.setSessionState(prevState => ({
      ...prevState,
      [SECRET]: update(prevState[SECRET] || {}),
    }))
  }

  private async setSessionState(update: ((prevState: any) => any)): Promise<void> {
    this.session.state = update(this.session.state || {});
    this.shouldSaveSession = true;
  }

  private async ensureSessionSaved() {
    if (this.shouldSaveSession) {
      await sessionMiddleware(this.ctx, () => {
        // @ts-ignore to set Set-Cookie response header
        this.session.touched = true;
      });

      // @ts-ignore store/update session in to adapter
      await this.session.save();
      this.shouldSaveSession = false;
    }
  }

  private shouldSaveSession = false;

  // utility methods
  private get isXHR() {
    return this.ctx.accepts(JSON, HTML) === JSON;
  }

  public assertPrompt(allowedPromptNames?: string[]): void {
    const { ctx, interaction } = this;
    ctx.assert(interaction && (!allowedPromptNames || allowedPromptNames.includes(interaction.prompt.name)));
  }

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

  // parse metadata and collect information
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

    await this.readProviderSession();
    return this;
  }

  private async readProviderSession() {
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

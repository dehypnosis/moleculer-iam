import { IdentityProvider } from "../idp";
import { Logger } from "../logger";
import { OIDCModelNames, OIDCVolatileModelNames, OIDCProviderProxy, OIDCProviderProxyOptions } from "./proxy";

export type OIDCProviderProps = {
  logger: Logger;
  idp: IdentityProvider;
};

export type OIDCProviderOptions = OIDCProviderProxyOptions;

// merge proxy props to type
// @ts-ignore
export interface OIDCProvider extends OIDCProviderProxy {
}

export class OIDCProvider {
  public static modelNames = OIDCModelNames;
  public static volatileModelNames = OIDCVolatileModelNames;

  private readonly logger: Logger;
  private readonly idp: IdentityProvider;
  private readonly proxy: OIDCProviderProxy;

  constructor(private readonly props: OIDCProviderProps, options: OIDCProviderOptions) {
    const {logger = console, idp} = this.props;
    this.logger = logger;
    this.idp = idp;

    // create proxy
    const proxy = this.proxy = new OIDCProviderProxy({
      logger,
      idp,
    }, options);

    // assign proxy props to this instance
    return new Proxy(this, {
      get(target, prop: keyof OIDCProvider & keyof OIDCProviderProxy) {
        return target[prop] || proxy[prop];
      },
    });
  }

  /* lifecycle */
  private working = false;

  public async start(): Promise<void> {
    if (this.working) {
      return;
    }

    // start idp
    await this.props.idp.start();

    // start proxy
    await this.proxy.start();

    this.working = true;
    this.logger.info(`oidc provider has been started`);
  }

  public async stop(): Promise<void> {
    if (!this.working) {
      return;
    }

    // stop idp
    await this.idp.stop();

    // stop proxy
    await this.proxy.stop();

    this.working = false;
    this.logger.info(`oidc provider has been stopped`);
  }

  // set available scopes and claims dynamically
  public async syncSupportedClaimsAndScopes(): Promise<void> {
  }
  /*
  TODO: provider methods add to proxy or here

  private get Client() {
    return this.provider.adapter.getModel<ClientMetadata>("Client");
  }

  public async findClient(id: string) {
    return this.Client.find(id);
  }

  public async findClientOrFail(id: string) {
    const client = await this.findClient(id);
    if (!client) {
      throw new errors.InvalidClient("client_not_found");
    }
    return client;
  }

  public async createClient(metadata: Omit<ClientMetadata, "client_secret">) {
    if (metadata.client_id && await this.findClient(metadata.client_id)) {
      throw new errors.InvalidClient("client_id_duplicated");
    }
    this.logger.info(`create client ${kleur.cyan(metadata.client_id)}:`, metadata);

    const client = await this.provider.methods.clientAdd({
      ...metadata,
      client_secret: OIDCProvider.generateClientSecret(),
    }, {store: true}) as Client;

    return client.metadata();
  }

  public async updateClient(metadata: Omit<ClientMetadata, "client_secret"> & { reset_client_secret?: boolean }) {
    const old = await this.findClient(metadata.client_id);

    // update client_secret
    if (metadata.reset_client_secret === true) {
      metadata = {
        ...metadata,
        client_secret: OIDCProvider.generateClientSecret(),
      };
      delete metadata.reset_client_secret;
    }

    this.logger.info(`update client ${kleur.cyan(metadata.client_id || "<unknown>")}:`, require("util").inspect(metadata));
    const client = await this.provider.methods.clientAdd({
      ...old,
      ...metadata,
    }, {store: true}) as Client;
    return client.metadata();
  }

  public async deleteClient(id: string) {
    await this.findClientOrFail(id);
    this.logger.info(`delete client ${kleur.cyan(id)}`);
    this.provider.methods.clientRemove(id);
  }

  public async getClients(args?: FindOptions) {
    return this.Client.get(args);
  }

  public async countClients(args?: WhereAttributeHash) {
    return this.Client.count(args);
  }

  private static generateClientSecret(): string {
    return uuid().replace(/\-/g, "") + uuid().replace(/\-/g, "");
  }

  public static readonly volatileModelNames: ReadonlyArray<VolatileOIDCModelName> = [
    "Session",
    "AccessToken",
    "AuthorizationCode",
    "RefreshToken",
    "DeviceCode",
    "InitialAccessToken",
    "RegistrationAccessToken",
    "Interaction",
    "ReplayDetection",
    "PushedAuthorizationRequest",
  ];

  public async countModels(kind: VolatileOIDCModelName, args?: WhereAttributeHash) {
    const model = this.provider.adapter.getModel<any>(kind);
    return model.count(args);
  }

  public async getModels(kind: OIDCModelName, args?: FindOptions) {
    const model = this.provider.adapter.getModel<any>(kind);
    return model.get(args);
  }

  public async deleteModels(kind: OIDCModelName, args?: FindOptions) {
    const model = this.provider.adapter.getModel<any>(kind);
    return model.delete(args);
  }

  public async syncSupportedClaimsAndScopes(): Promise<void> {
    // set available scopes and claims
    const claimsSchemata = await this.idp.claims.getActiveClaimsSchemata();
    this.provider.syncSupportedClaimsAndScopes(claimsSchemata);
  }
   */
}

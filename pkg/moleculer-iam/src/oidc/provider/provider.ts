import * as kleur from "kleur";
import uuid from "uuid";
import { FindOptions, WhereAttributeHash } from "../../helper/rdbms";
import { IdentityProvider } from "../../identity";
import { Logger } from "../../logger";
import { OIDCProviderOptions, parseOIDCProviderOptions } from "./options";

export type OIDCProviderProps = {
  logger?: Logger,
  idp: IdentityProvider,
};

export class OIDCProvider {
  private readonly logger: Logger;
  private readonly wrapper: ReturnType<typeof parseOIDCProviderOptions>;

  constructor(private readonly props: OIDCProviderProps, options: OIDCProviderOptions) {
    const logger = this.logger = props.logger || console;
    const idp = props.idp;
    this.provider = parseOIDCProviderOptions({ logger, idp }, options);
  }

  public get idp() {
    return this.props.idp;
  }

  public get routes() {
    return this.provider.routes;
  }

  public get config(): Configuration {
    return this.provider.methods.configuration();
  }

  public get issuer() {
    return this.provider.issuer;
  }

  /* lifecycle */
  private working = false;

  public async start(): Promise<void> {
    if (this.working) {
      return;
    }

    // start idp
    await this.idp.start();
    await this.syncSupportedClaimsAndScopes();

    // start adapter
    await this.provider.adapter.start();

    this.working = true;
    this.logger.info(`oidc provider has been started`);
  }

  public async stop(): Promise<void> {
    if (!this.working) {
      return;
    }

    // stop adapter
    await this.provider.adapter.stop();

    // stop idp
    await this.idp.stop();

    this.working = false;
    this.logger.info(`oidc provider has been stopped`);
  }

  /* client management */
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

  /* "Session"|"AuthorizationCode"|"DeviceCode"|"AccessToken"|"RefreshToken"|"RegistrationAccessToken" management */
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

  /* dynamic claims and schema management */
  public async syncSupportedClaimsAndScopes(): Promise<void> {
    // set available scopes and claims
    const claimsSchemata = await this.idp.claims.getActiveClaimsSchemata();
    this.provider.syncSupportedClaimsAndScopes(claimsSchemata);
  }
}

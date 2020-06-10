import * as kleur from "kleur";
import { v4 as uuid } from "uuid";
import { pick as pickLanguage } from "accept-language-parser";
import { Configuration, Provider } from "oidc-provider";
import { FindOptions, WhereAttributeHash } from "../../lib/rdbms";
import { Logger } from "../../lib/logger";
import { IdentityProvider } from "../../idp";
import { buildApplication, ApplicationBuildOptions } from "../app";
import { OIDCAdapterProxy, OIDCModelName } from "./adapter";
import { ProviderConfigBuilder, StaticConfiguration } from "./config";
import { OIDCErrors } from "./error.types";
import { DiscoveryMetadata, Client, ClientMetadata } from "./proxy.types";

// ref: https://github.com/panva/node-oidc-provider/blob/9306f66bdbcdff01400773f26539cf35951b9ce8/lib/models/client.js#L385
// @ts-ignore : need to hack oidc-provider private methods
import getProviderHiddenProps from "oidc-provider/lib/helpers/weak_cache";


export type OIDCProviderProxyProps = {
  logger: Logger;
  idp: IdentityProvider;
};

export type OIDCProviderProxyOptions = StaticConfiguration & {
  app?: ApplicationBuildOptions;
};

export type ParsedLocale  = {
  language: string;
  region: string;
}

export class OIDCProviderProxy {
  private readonly logger: Logger;
  private readonly provider: Provider;
  private readonly adapter: OIDCAdapterProxy;

  constructor(private readonly props: OIDCProviderProxyProps, options: OIDCProviderProxyOptions) {
    const {logger, idp } = props;
    this.logger = logger;

    // apply static options and get the provider instance and proxy config which can be set dynamically
    const { app, ...staticConfig } = options;
    const builder = new ProviderConfigBuilder({
      logger,
      idp,
    }, staticConfig);

    // build main logic with options
    buildApplication(builder, app);

    // create provider and adapter
    this.provider = builder._dangerouslyBuild();
    this.adapter = builder.adapter;
  }

  private get hidden() {
    return getProviderHiddenProps(this.provider);
  }

  // http handler application (Koa)
  public get app() {
    return this.provider!.app;
  }

  public get configuration(): Configuration {
    return this.hidden.configuration();
  }

  private _supportedLocales?: string[];
  public get supportedLocales(): string[] {
    if (!this._supportedLocales) {
      this._supportedLocales = [...new Set([...(this.configuration.discovery as DiscoveryMetadata).ui_locales_supported || []])];
    }
    return this._supportedLocales;
  }

  public parseLocale(locale?: string): ParsedLocale {
    const locales = this.supportedLocales;
    const raw = pickLanguage(locales, locale || "", { loose: true }) || locales[0] || "ko-KR";
    const [language, region] = raw.split("-");
    const [_, requestedRegion] = (locale || "").split("-"); // request locale region will take precedence over matched one
    return { language, region: requestedRegion || region || "KR" };
  }

  public get issuer() {
    return this.provider!.issuer;
  }

  public async start() {
    await this.adapter.start();
    await this.syncSupportedClaimsAndScopes();
  }

  public stop() {
    return this.adapter.stop();
  }

  // programmable interfaces
  public get Session() {
    return this.adapter.getModel("Session")
  }
  public get AccessToken() {
    return this.adapter.getModel("AccessToken")
  }
  public get AuthorizationCode() {
    return this.adapter.getModel("AuthorizationCode")
  }
  public get RefreshToken() {
    return this.adapter.getModel("RefreshToken")
  }
  public get DeviceCode() {
    return this.adapter.getModel("DeviceCode")
  }
  public get ClientCredentials() {
    return this.adapter.getModel("ClientCredentials")
  }
  public get Client() {
    return this.adapter.getModel("Client")
  }
  public get InitialAccessToken() {
    return this.adapter.getModel("InitialAccessToken")
  }
  public get RegistrationAccessToken() {
    return this.adapter.getModel("RegistrationAccessToken")
  }
  public get Interaction() {
    return this.adapter.getModel("Interaction")
  }
  public get ReplayDetection() {
    return this.adapter.getModel("ReplayDetection")
  }
  public get PushedAuthorizationRequest() {
    return this.adapter.getModel("PushedAuthorizationRequest")
  }

  public async findClient(id: string) {
    return this.Client.find(id);
  }

  public async findClientOrFail(id: string) {
    const client = await this.findClient(id);
    if (!client) {
      throw new OIDCErrors.InvalidClient("client_not_found");
    }
    return client;
  }

  public async createClient(metadata: Omit<ClientMetadata, "client_secret">) {
    if (metadata.client_id && await this.findClient(metadata.client_id)) {
      throw new OIDCErrors.InvalidClient("client_id_duplicated");
    }
    this.logger.info(`create client ${kleur.cyan(metadata.client_id)}:`, metadata);

    const client = await this.hidden.clientAdd({
      ...metadata,
      client_secret: OIDCProviderProxy.generateClientSecret(),
    }, {store: true}) as Client;

    return client.metadata();
  }

  public async updateClient(metadata: Omit<ClientMetadata, "client_secret"> & { reset_client_secret?: boolean }) {
    const old = await this.findClient(metadata.client_id);

    // update client_secret
    if (metadata.reset_client_secret === true) {
      metadata = {
        ...metadata,
        client_secret: OIDCProviderProxy.generateClientSecret(),
      };
      delete metadata.reset_client_secret;
    }

    this.logger.info(`update client ${kleur.cyan(metadata.client_id || "<unknown>")}:`, require("util").inspect(metadata));
    const client = await this.hidden.clientAdd({
      ...old,
      ...metadata,
    }, {store: true}) as Client;
    return client.metadata();
  }

  public async deleteClient(id: string) {
    await this.findClientOrFail(id);
    this.logger.info(`delete client ${kleur.cyan(id)}`);
    this.hidden.clientRemove(id);
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

  public static readonly volatileModelNames: ReadonlyArray<Exclude<OIDCModelName, "Client"|"ClientCredentials">> = [
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

  public async countModels(kind: (typeof OIDCProviderProxy.volatileModelNames)[number], args?: WhereAttributeHash) {
    const model = this.adapter.getModel(kind);
    return model.count(args);
  }

  public async getModels(kind: (typeof OIDCProviderProxy.volatileModelNames)[number], args?: FindOptions) {
    const model = this.adapter.getModel(kind);
    return model.get(args);
  }

  public async deleteModels(kind: (typeof OIDCProviderProxy.volatileModelNames)[number], args?: FindOptions) {
    const model = this.adapter.getModel(kind);
    return model.delete(args);
  }

  public async syncSupportedClaimsAndScopes(): Promise<void> {
    // set available scopes and claims
    const claimsSchemata = await this.props.idp.claims.getActiveClaimsSchemata();
    this.updateSupportedClaimsAndScopes(claimsSchemata);
  }

  // set supported claims and scopes (hacky)
  // ref: https://github.com/panva/node-oidc-provider/blob/ae8a4589c582b96f4e9ca0432307da15792ac29d/lib/helpers/claims.js#L54
  private updateSupportedClaimsAndScopes(defs: ReadonlyArray<{scope: string, key: string}>) {
    const config = this.configuration;
    const claimsFilter = config.claims as unknown as Map<string, null | { [claim: string]: any }>;
    const claimsSupported = (config as any).claimsSupported as Set<string>;
    defs.forEach(schema => {
      let obj = claimsFilter.get(schema.scope);
      if (obj === null) {
        return;
      }
      if (!obj) {
        obj = {};
        claimsFilter.set(schema.scope, obj);
      }
      obj[schema.key] = null;
      claimsSupported.add(schema.key);
    });

    const scopes = config.scopes as unknown as Set<string>;
    const availableScopes = defs.map(schema => schema.scope).concat(["openid", "offline_access"]);
    for (const s of availableScopes) {
      scopes.add(s);
    }
    for (const s of scopes.values()) {
      if (!availableScopes.includes(s)) {
        scopes.delete(s);
      }
    }

    // log result
    this.logger.info(`available claims for each scopes has been updated:\n${
      [...claimsFilter.entries()]
        .map(([scope, claims]) => {
          return claims
            ? `${kleur.green(scope.padEnd(20))}: ${kleur.white(Object.keys(claims).join(", "))}`
            : `${kleur.green().dim("(token)".padEnd(20))}: ${kleur.dim(scope)}`;
        })
        .join("\n")
    }`);
  }
}

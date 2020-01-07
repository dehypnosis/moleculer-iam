import * as kleur from "kleur";
import * as _ from "lodash";
import mount from "koa-mount";
import compose from "koa-compose";
import uuid from "uuid";
import { FindOptions } from "../../helper/rdbms";
import { IdentityProvider } from "../../identity";
import { Logger } from "../../logger";
import { ClientApplicationRenderer, InteractionFactory, InternalInteractionConfigurationFactory } from "../interaction";
import { Client, ClientMetadata, errors, Provider as OriginalProvider, Configuration as OriginalProviderConfiguration } from "./types";
import { OIDCAdapter, OIDCAdapterConstructors } from "../adapter";
import { defaultOIDCProviderOptions, OIDCProviderOptions } from "./options";
import { applyDebugOptions } from "./debug";

// @ts-ignore : need to hack oidc-provider private methods
import getProviderHiddenProps from "oidc-provider/lib/helpers/weak_cache";

export type OIDCProviderProps = {
  logger?: Logger,
  idp: IdentityProvider,
};

export class OIDCProvider {
  private readonly logger: Logger;
  private readonly adapter: OIDCAdapter;
  private readonly original: OriginalProvider;
  private readonly clientApp: ClientApplicationRenderer;
  private readonly clientAppClientOptions: Omit<ClientMetadata, "client_secret">;
  public readonly router: compose.ComposedMiddleware<any>;

  constructor(private readonly props: OIDCProviderProps, options: OIDCProviderOptions) {
    const idp = props.idp;
    const logger = this.logger = props.logger || console;
    const {issuer, trustProxy, adapter, app, devMode, ...providerConfig} = _.defaultsDeep(options || {}, defaultOIDCProviderOptions);
    const devModeEnabled = devMode || issuer.startsWith("http://");

    /* create provider adapter */
    const adapterKey: keyof (typeof OIDCAdapterConstructors) = Object.keys(OIDCAdapterConstructors).find(k => k.toLowerCase() === options.adapter!.type.toLowerCase())
      || Object.keys(OIDCAdapterConstructors)[0] as any;
    this.adapter = new OIDCAdapterConstructors[adapterKey]({
      logger,
    }, options.adapter!.options);

    /* create provider interactions factory and client app renderer */
    const clientAppOption = app || {};
    if (devModeEnabled) {
      logger.info("disable assets cache for debugging purpose");
      clientAppOption.assetsCacheMaxAge = 0;
    }
    const clientApp = this.clientApp = new ClientApplicationRenderer({
      logger,
    }, clientAppOption);

    const internalInteractionConfigFactory = new InternalInteractionConfigurationFactory({
      app: clientApp,
      logger,
      idp,
    });

    const interactionFactory = new InteractionFactory({
      app: clientApp,
      logger,
      idp,
    }, {federation: options.federation, devModeEnabled});

    /* create original provider */
    const config: OriginalProviderConfiguration = _.defaultsDeep({
      // persistent storage for OP
      adapter: this.adapter.originalAdapterProxy,

      // all dynamic scopes (eg. user:update, calendar:remove, ..) are implicitly accepted
      dynamicScopes: [/.+/],

      // client metadata for local client management and custom claims schema
      extraClientMetadata: {
        properties: ["skip_consent"],
        validator(k, v, meta) {
          switch (k) {
            case "skip_consent":
              if (typeof v !== "boolean") {
                // throw new errors.InvalidClientMetadata("skip_consent should be boolean type value");
                meta.skip_consent = false;
              }
              break;
            default:
              throw new errors.InvalidClientMetadata("unknown client property: " + k);
          }
        },
      },

      // bridge between IDP and OP
      async findAccount(ctx, id: string, token?: string) {
        // token is a reference to the token used for which a given account is being loaded,
        // it is undefined in scenarios where account claims are returned from authorization endpoint
        // ctx is the koa request context
        return idp.findOrFail({id})
          .catch(async err => {
            await ctx.oidc.session.destroy();
            throw err;
          });
      },

      // interactions and configuration
      interactions: interactionFactory.interactions(),
      ...internalInteractionConfigFactory.configuration(),
    } as OriginalProviderConfiguration, providerConfig);

    const original = this.original = new OriginalProvider(issuer, config);
    original.env = "production";
    original.proxy = trustProxy !== false;

    // mount interaction routes
    original.app.use(interactionFactory.routes(original));

    // apply debugging features
    if (devModeEnabled) {
      applyDebugOptions(original, logger, {
        "disable-implicit-forbid-localhost": true,
        "disable-implicit-force-https": true,
      });
    }

    /* prepare client app oidc client options */
    this.clientAppClientOptions = _.defaultsDeep(clientAppOption.client || {}, {
      client_id: issuer.replace("https://","").replace("http://","").replace(":","-"),
      client_name: "Account Manager",
      client_uri: issuer,
      application_type: "web" as "web",
      policy_uri: `${issuer}/help/policy`,
      tos_uri: `${issuer}/help/tos`,
      logo_uri: undefined,
      redirect_uris: [...new Set([issuer].concat(devModeEnabled ? ["http://localhost:9191", "http://localhost:9090", "http://localhost:8080", "http://localhost:3000"] : []))],
      post_logout_redirect_uris: [issuer],
      frontchannel_logout_uri: `${issuer}`,
      frontchannel_logout_session_required: true,
      grant_types: ["implicit", "authorization_code", "refresh_token"],
      response_types: ["code", "id_token", "id_token token", "code id_token", "code token", "code id_token token", "none"],
      token_endpoint_auth_method: "none",

      /* custom props */
      skip_consent: true,
    });

    /* create router */
    this.router = compose([
      mount(this.original.app as any),
      this.clientApp.router,
    ]) as any;
  }

  public get idp() {
    return this.props.idp;
  }

  public get config(): OriginalProviderConfiguration {
    return getProviderHiddenProps(this.original).configuration();
  }

  public get defaultRoutes(): Readonly<{ [key: string]: string | undefined }> {
    return {
      discovery: "/.well-known/openid-configuration",
      ...this.config.routes,
    };
  }

  public get discoveryPath() {
    return `/.well-known/openid-configuration`;
  }

  public get issuer() {
    return this.original.issuer;
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
    await this.adapter.start();

    // assert app client
    try {
      await this.client.create(this.clientAppClientOptions);
    } catch (err) {
      if (err.error === "invalid_client") {
        try {
          await this.client.update(this.clientAppClientOptions);
        } catch (err) {
          this.logger.error(err);
        }
      } else {
        this.logger.error(err);
      }
    }

    this.working = true;
    this.logger.info(`oidc provider has been started`);

    this.logger.info(`available oidc endpoints:\n${
      [...Object.entries(this.defaultRoutes)]
        .map(([key, path]) => {
          return `${kleur.green(key.padEnd(30))}: ${kleur.cyan(`${this.issuer}${path || "/???"}`)}`;
        })
        .join("\n")
    }`);
  }

  public async stop(): Promise<void> {
    if (!this.working) {
      return;
    }

    // stop adapter
    await this.adapter.stop();

    // stop idp
    await this.idp.stop();

    this.working = false;
    this.logger.info(`oidc provider has been stopped`);
  }

  /* bind management methods */
  public get client(): ReturnType<OIDCProvider["createClientMethods"]> {
    if (!this.clientMethods) {
      this.clientMethods = this.createClientMethods();
    }
    return this.clientMethods;
  }

  private clientMethods?: ReturnType<OIDCProvider["createClientMethods"]>;

  private createClientMethods() {
    const provider = this;
    const originalMethods = getProviderHiddenProps(provider.original);
    const model = this.adapter.getModel<ClientMetadata>("Client");
    const methods = {
      async find(id: string) {
        return model.find(id);
      },

      async findOrFail(id: string) {
        const client = await this.find(id);
        if (!client) {
          throw new errors.InvalidClient("client_not_found");
        }
        return client;
      },

      async create(metadata: Omit<ClientMetadata, "client_secret">) {
        if (metadata.client_id && await methods.find(metadata.client_id)) {
          throw new errors.InvalidClient("client_id_duplicated");
        }
        provider.logger.info(`create client ${kleur.cyan(metadata.client_id)}:`, metadata);

        const client = await originalMethods.clientAdd({
          ...metadata,
          client_secret: OIDCProvider.generateClientSecret(),
        }, {store: true}) as Client;

        return client.metadata();
      },

      async update(metadata: Omit<ClientMetadata, "client_secret"> & { reset_client_secret?: boolean }) {
        const old = await methods.find(metadata.client_id);

        // update client_secret
        if (metadata.reset_client_secret === true) {
          metadata = {
            ...metadata,
            client_secret: OIDCProvider.generateClientSecret(),
          };
          delete metadata.reset_client_secret;
        }

        provider.logger.info(`update client ${kleur.cyan(metadata.client_id || "<unknown>")}:`, require("util").inspect(metadata));
        const client = await originalMethods.clientAdd({
          ...old,
          ...metadata,
        }, {store: true}) as Client;
        return client.metadata();
      },

      async delete(id: string) {
        await methods.findOrFail(id);
        provider.logger.info(`delete client ${kleur.cyan(id)}`);
        originalMethods.clientRemove(id);
      },

      async get(opts?: FindOptions) {
        return await model.get(opts);
      },

      async count() {
        return model.count();
      },
    };

    return methods;
  }

  private static generateClientSecret(): string {
    return uuid().replace(/\-/g, "") + uuid().replace(/\-/g, "");
  }

  // public updateScopes(scope: string, scopeClaimsSchema: ValidationSchema) {
  //   const scopes = new Set(this.config.scopes);
  //   const claimNamesForScopes = _.cloneDeep(this.config.claims);
  //
  //   // TODO: this.idp.updateCustomClaimsSchema
  // }

  public async syncSupportedClaimsAndScopes(): Promise<void> {
    // set available scopes and claims
    const claimsSchemata = await this.idp.claims.getActiveClaimsSchemata();

    // set supported option (hacky)
    // ref: https://github.com/panva/node-oidc-provider/blob/ae8a4589c582b96f4e9ca0432307da15792ac29d/lib/helpers/claims.js#L54
    const claimsFilter = this.config.claims! as unknown as Map<string, null | { [claim: string]: any }>;
    const claimsSupported = (this.config as any).claimsSupported as Set<string>;
    claimsSchemata.forEach(schema => {
      let obj = claimsFilter.get(schema.scope);
      if (obj === null) return;
      if (!obj) {
        obj = {};
        claimsFilter.set(schema.scope, obj);
      }
      obj[schema.key] = null;
      claimsSupported.add(schema.key);
    });

    // set supported scopes (also hacky)
    const scopes = this.config.scopes as unknown as Set<string>;
    const availableScopes = claimsSchemata.map(schema => schema.scope).concat(["openid", "offline_access"]);
    for (const s of availableScopes) {
      scopes.add(s);
    }
    for (const s of scopes.values()) {
      if (!availableScopes.includes(s)) {
        scopes.delete(s);
      }
    }

    // log result
    this.logger.info(`available idp claims per scope:\n${
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

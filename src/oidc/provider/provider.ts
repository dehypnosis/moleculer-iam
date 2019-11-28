import * as kleur from "kleur";
import * as _ from "lodash";
import mount from "koa-mount";
import { FindOptions } from "../../helper/rdbms";
import { IdentityProvider } from "../../identity";
import { Logger } from "../../logger";
import { Client, ClientMetadata, errors, Provider as OriginalProvider, Configuration as OriginalProviderConfiguration } from "./types";
import { OIDCAdapter, OIDCAdapterConstructors } from "../adapter";
import { defaultOIDCProviderOptions, OIDCProviderOptions } from "./options";
import { interactionConfiguration, createInteractionRouter } from "../interaction";
import { applyDebugOptions } from "./debug";

// @ts-ignore : need to hack oidc-provider private methods
import getProviderHiddenProps from "oidc-provider/lib/helpers/weak_cache";

export type OIDCProviderProps = {
  logger?: Logger,
  identity: IdentityProvider,
};

export class OIDCProvider {
  private readonly logger: Logger;
  private readonly adapter: OIDCAdapter;
  private readonly original: OriginalProvider;

  constructor(private readonly props: OIDCProviderProps, options: OIDCProviderOptions) {
    const logger = this.logger = props.logger || console;
    const {issuer, trustProxy, adapter, ...providerConfig} = _.defaultsDeep(options || {}, defaultOIDCProviderOptions);

    /* create provider adapter */
    const adapterKey: keyof (typeof OIDCAdapterConstructors) = Object.keys(OIDCAdapterConstructors).find(k => k.toLowerCase() === options.adapter!.type.toLowerCase())
      || Object.keys(OIDCAdapterConstructors)[0] as any;
    this.adapter = new OIDCAdapterConstructors[adapterKey]({
      logger,
    }, options.adapter!.options);

    /* create original provider */
    const config: OriginalProviderConfiguration = _.defaultsDeep({
      // persistent storage for OP
      adapter: this.adapter.originalAdapterProxy,

      // bridge between IDP and OP
      async findAccount(ctx, id: string, token?: string) {
        // token is a reference to the token used for which a given account is being loaded,
        // it is undefined in scenarios where account claims are returned from authorization endpoint
        // ctx is the koa request context
        return props.identity.find(id);
      },

      // user interactions
      ...interactionConfiguration,
    } as OriginalProviderConfiguration, providerConfig);
    const original = this.original = new OriginalProvider(issuer, config);
    original.env = "production";
    original.proxy = trustProxy !== false;

    // attach logger
    original.app.use((ctx, next) => {
      ctx.logger = logger;
      return next();
    });

    // mount routes
    original.app.use(createInteractionRouter(original, props.identity).routes());

    // apply debugging features
    if (issuer.startsWith("http://")) {
      applyDebugOptions(original, logger, {
        "disable-implicit-forbid-localhost": true,
        "disable-implicit-force-https": true,
      });
    }
  }

  public get idp() {
    return this.props.identity;
  }

  public get config(): OriginalProviderConfiguration {
    return getProviderHiddenProps(this.original).configuration();
  }

  public get defaultRoutes(): Readonly<{[key: string]: string | undefined}> {
    return {
      discovery: "/.well-known/openid-configuration",
      ...this.config.routes,
    };
  }

  public get router() {
    return mount(this.original.app);
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

    // start adapter
    await this.adapter.start();

    this.working = true;
    this.logger.info(`oidc provider has been started:`, this.defaultRoutes);
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

  /* bind lazy methods */
  public get client() {
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
          throw new errors.InvalidClient("client not found");
        }
        return client;
      },

      async create(metadata: ClientMetadata) {
        if (metadata.client_id && await methods.find(metadata.client_id)) {
          throw new errors.InvalidClient("client_id is duplicated");
        }
        provider.logger.info(`create client ${kleur.cyan(metadata.client_id)}:`, metadata);

        const client = await originalMethods.clientAdd(metadata, {store: true}) as Client;
        return client.metadata();
      },

      async update(metadata: ClientMetadata) {
        await methods.find(metadata.client_id);
        provider.logger.info(`update client ${kleur.cyan(metadata.client_id || "<unknown>")}:`, metadata);
        const client = await originalMethods.clientAdd(metadata, {store: true}) as Client;
        return client.metadata();
      },

      async remove(id: string) {
        await methods.findOrFail(id);
        provider.logger.info(`remove client ${kleur.cyan(id)}`);
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
}

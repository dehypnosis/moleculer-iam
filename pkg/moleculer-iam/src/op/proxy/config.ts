import * as kleur from "kleur";
import * as _ from "lodash";
import { Provider, Configuration } from "oidc-provider";
import { IdentityProvider } from "../../idp";
import { Logger } from "../../helper/logger";
import { OIDCAdapterProxy, OIDCAdapterProxyConstructorOptions, OIDCAdapterProxyConstructors } from "./adapter";
import { defaultStaticConfig } from "./config.default";
import { ProviderApplicationBuilder } from "./app";
import { DiscoveryMetadata } from "./proxy.types";

// not support static clients, claims, scopes definition to support distributed environment
type UnsupportedConfigurationKeys =
  "clients"
  |"claims"
  |"scopes"
  |"dynamicScopes";

type DynamicConfigurationKeys =
  // partial configuration which should be set by builder
  "findAccount"
  |"extraClientMetadata"
  |"extraParams"
  |"interactions"
  // set by app builder
  |"routes"
  |"renderError"
  |"logoutSource"
  |"postLogoutSuccessSource"

// set by app builder
type DeviceFlowConfigurationKeys = "userCodeInputSource" | "userCodeConfirmSource" | "successSource";
export type DeviceFlowConfiguration = Required<Required<Configuration>["features"]>["deviceFlow"];
type DynamicFeaturesConfiguration = {
  features: {
    deviceFlow: { [key in DeviceFlowConfigurationKeys]: DeviceFlowConfiguration[key]; };
  };
};

export type DynamicConfiguration = Required<Pick<Configuration, DynamicConfigurationKeys> & DynamicFeaturesConfiguration>;

/* partial configuration which should be set statically */
export type StaticConfiguration = Omit<Configuration,
  UnsupportedConfigurationKeys
  // set by adapter proxy options
  | "adapter"
  // define discovery metadata
  |"discovery"
  > & {
  adapter?: OIDCAdapterProxyConstructorOptions;
  discovery?: DiscoveryMetadata;

  // mandatory options.. but missing in original Configuration
  dev?: boolean;
  issuer?: string;
}

export type ProviderBuilderProps = {
  logger: Logger;
  idp: IdentityProvider;
};

export class ProviderConfigBuilder {
  public readonly logger: Logger;
  public readonly issuer: string;
  public readonly dev: boolean;
  public readonly adapter: OIDCAdapterProxy;
  public readonly idp: IdentityProvider;
  public readonly app: ProviderApplicationBuilder;
  private readonly staticConfig: StaticConfiguration;
  private readonly dynamicConfig: DynamicConfiguration;
  private provider?: Provider;

  constructor(private readonly props: ProviderBuilderProps, opts: Partial<StaticConfiguration> = {}) {
    const {logger, idp} = props;
    this.logger = logger;
    this.idp = idp;

    // arrange static config
    const {issuer, dev, adapter, partialStaticConfig} = (_opts => {
      // tslint:disable-next-line:no-shadowed-variable
      const {issuer = "http://localhost:9090", dev = false, adapter = {}, ...partialStaticConfig} = _opts;

      // create adapter
      const adapterConfig = _.defaultsDeep(adapter, {
        type: "Memory",
        options: {},
      }) as OIDCAdapterProxyConstructorOptions;
      const adapterKey: keyof (typeof OIDCAdapterProxyConstructors) = Object.keys(OIDCAdapterProxyConstructors).find(k => k.toLowerCase() === adapterConfig.type.toLowerCase())
        || Object.keys(OIDCAdapterProxyConstructors)[0] as any;
      const adapterInstance = new OIDCAdapterProxyConstructors[adapterKey]({
        logger,
      }, adapterConfig.options);

      return {
        issuer,
        dev: dev || issuer.startsWith("http://"),
        adapter: adapterInstance,
        partialStaticConfig,
      }
    })(opts);

    this.issuer = issuer;
    this.dev = dev;
    this.adapter = adapter;

    // create app builder
    this.app = new ProviderApplicationBuilder(this);

    // create static config
    this.staticConfig = _.defaultsDeep({
      // set adapter constructor
      adapter: adapter.adapterConstructorProxy,
      // set unsupported static clients, claims, scopes definition to support distributed environment
      clients: undefined,
      claims: undefined,
      scopes: undefined,
      dynamicScopes: [/.+/],
    }, partialStaticConfig, defaultStaticConfig) as StaticConfiguration;

    // create dynamic config which are linked to app builder
    this.dynamicConfig = _.defaultsDeep(this.app._dangerouslyGetDynamicConfiguration(), {
      // bridge for IDP and OP session
      findAccount: (ctx, id, token) => {
        return idp.findOrFail({id})
          .catch(async err => {
            await ctx.oidc.session!.destroy();
            throw err;
          });
      },
      extraClientMetadata: undefined as any,
      extraParams: undefined as any,
      routes: undefined as any,
    } as Partial<DynamicConfiguration>);
  }

  public _dagerouslyGetProvider(): Provider {
    return this.provider!;
  }

  public setPrefix(prefix: string) {
    this.assertBuilding();

    // set app named url
    this.dynamicConfig.routes = {
      jwks: `${prefix}/jwks`,
      authorization: `${prefix}/auth`,
      pushed_authorization_request: `${prefix}/request`,
      check_session: `${prefix}/session/check`,
      end_session: `${prefix}/session/end`,
      code_verification: `${prefix}/device`,
      device_authorization: `${prefix}/device/auth`,
      token: `${prefix}/token`,
      introspection: `${prefix}/token/introspect`,
      revocation: `${prefix}/token/revoke`,
      userinfo: `${prefix}/userinfo`,
      registration: `${prefix}/client/register`,
    };
    this.logger.info(`OIDC named route path configured:`, this.dynamicConfig.routes);

    // set app router prefix
    this.app._dangerouslySetPrefix(prefix);

    return this;
  }

  public setExtraParams(config: DynamicConfiguration["extraParams"]) {
    this.assertBuilding();
    this.dynamicConfig.extraParams = config;
    return this;
  }

  public setExtraClientMetadata(config: DynamicConfiguration["extraClientMetadata"]) {
    this.assertBuilding();
    this.dynamicConfig.extraClientMetadata = config;
    return this;
  }

  private built = false;

  public assertBuilding(shouldBuilt = false) {
    if (!shouldBuilt && this.built) {
      throw new Error("provider configuration already built");
    } else if (shouldBuilt && !this.built) {
      throw new Error("provider configuration has not been built yet")
    }
  }

  public _dangerouslyBuild() {
    this.assertBuilding();
    const { logger } = this;

    // create provider with config proxy
    const provider = this.provider = new Provider(this.issuer, _.defaultsDeep(this.dynamicConfig, this.staticConfig));
    // provider.env = "production";
    // provider.proxy = true; // trust http proxy header

    // ref: https://github.com/panva/node-oidc-provider/tree/master/recipes#oidc-provider-recipes
    if (this.dev) {
      ((features: {
        [key in "disable-implicit-force-https" | "disable-implicit-forbid-localhost"]: boolean;
      }) => {
        // extend client schema validation
        if (features["disable-implicit-force-https"] || features["disable-implicit-forbid-localhost"]) {
          // @ts-ignore
          const invalidateClientSchema = provider.Client.Schema.prototype.invalidate;

          // @ts-ignore
          provider.Client.Schema.prototype.invalidate = function(message: any, code: string) {
            if (code === "implicit-force-https" || code === "implicit-forbid-localhost") {
              logger.warn(`ignore error ${kleur.red(code)} for debugging purpose in client ${kleur.cyan(this.client_id)} schema validation`);
              return;
            }
            invalidateClientSchema.call(this, message);
          };
        }
      })({
        "disable-implicit-forbid-localhost": true,
        "disable-implicit-force-https": true,
      });
    }

    // mount app routes
    this.app._dangerouslyBuild();

    this.built = true;
    return provider;
  }
}

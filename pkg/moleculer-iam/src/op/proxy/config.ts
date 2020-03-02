import * as kleur from "kleur";
import * as _ from "lodash";
import { Provider, Configuration, interactionPolicy } from "oidc-provider";
import { IdentityProvider } from "../../idp";
import { Logger } from "../../logger";
import { OIDCAdapterProxy, OIDCAdapterProxyConstructorOptions, OIDCAdapterProxyConstructors } from "./adapter";
import { defaultStaticConfig } from "./config.default";
import { ProviderInteractionBuilder } from "./config.interaction";
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
  // set by interaction builder
  |"routes"
  |"renderError"
  |"logoutSource"
  |"postLogoutSuccessSource"

// set by interaction builder
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
  public readonly staticConfig: StaticConfiguration;
  private readonly dynamicConfig: DynamicConfiguration;
  private readonly issuer: string;
  public readonly dev: boolean;
  public readonly adapter: OIDCAdapterProxy;
  public readonly interaction: ProviderInteractionBuilder;
  public readonly idp: IdentityProvider;
  private provider?: Provider;

  constructor(private readonly props: ProviderBuilderProps, opts: Partial<StaticConfiguration> = {}) {
    const { logger, idp } = props;
    this.logger = logger;
    this.idp = idp;

    // arrange static config
    const { issuer, dev, adapter, partialStaticConfig } = (_opts => {
      // tslint:disable-next-line:no-shadowed-variable
      const { issuer = "http://localhost:9090", dev = false, adapter = {}, ...partialStaticConfig } = _opts;

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
    this.interaction = new ProviderInteractionBuilder({
      logger,
      idp,
      dev,
      issuer,
      getProvider: () => this.provider!,
    });
    this.staticConfig = _.defaultsDeep({

      // set adapter constructor
      adapter: adapter.adapterConstructorProxy,
      // set unsupported static clients, claims, scopes definition to support distributed environment
      clients: undefined,
      claims: undefined,
      scopes: undefined,
      dynamicScopes: [/.+/],
    }, partialStaticConfig, defaultStaticConfig) as StaticConfiguration;

    // create dynamic options
    const {
      deviceFlowUserCodeInputSourceProxy, deviceFlowUserCodeConfirmSourceProxy, deviceFlowSuccessSourceProxy,
      renderErrorProxy, logoutSourceProxy, postLogoutSuccessSourceProxy,
    } = this.interaction.namedRoutesProxy;
    this.dynamicConfig = {
      findAccount: undefined as any,
      extraClientMetadata: undefined as any,
      extraParams: undefined as any,
      interactions: undefined as any,
      routes: undefined as any,
      features: {
        deviceFlow: {
          userCodeInputSource: deviceFlowUserCodeInputSourceProxy,
          userCodeConfirmSource: deviceFlowUserCodeConfirmSourceProxy,
          successSource: deviceFlowSuccessSourceProxy,
        },
      },
      renderError: renderErrorProxy,
      logoutSource: logoutSourceProxy,
      postLogoutSuccessSource: postLogoutSuccessSourceProxy,
    } as DynamicConfiguration;
  }

  public setPrefix(prefix: string) {
    // set interaction url
    this.dynamicConfig.interactions = {
      ...this.dynamicConfig.interactions,
      url: (ctx, interaction) => {
        return `${prefix}/${interaction.prompt.name}`;
      },
    };
    this.logger.info(`interaction url generation rule configured:`, `${prefix}/:interaction-prompt-name`);

    // set interaction router prefix
    this.interaction._dangerouslySetPrefix(prefix);

    // set interaction named url
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
    this.logger.info(`named routes path configured:`, this.dynamicConfig.routes);

    return this;
  }

  public setFindAccount(config: DynamicConfiguration["findAccount"]) {
    this.dynamicConfig.findAccount = config;
    return this;
  }

  public setExtraParams(config: DynamicConfiguration["extraParams"]) {
    this.dynamicConfig.extraParams = config;
    return this;
  }

  public setExtraClientMetadata(config: DynamicConfiguration["extraClientMetadata"]) {
    this.dynamicConfig.extraClientMetadata = config;
    return this;
  }

  public setInteractionPolicy(config: NonNullable<DynamicConfiguration["interactions"]["policy"]>) {
    this.dynamicConfig.interactions = {
      ...this.dynamicConfig.interactions,
      policy: config,
    };
    return this;
  }

  public build() {
    const { logger } = this;

    // create provider with config proxy
    const provider = this.provider = new Provider(this.issuer, _.defaultsDeep(this.dynamicConfig, this.staticConfig));

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

    // mount interaction routes
    this.interaction.build();

    // delegate programmable implementation to OIDCProviderProxy now
    return provider;
  }
}

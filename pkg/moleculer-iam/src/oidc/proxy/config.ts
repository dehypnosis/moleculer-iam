import crypto from "crypto";
import * as kleur from "kleur";
import * as _ from "lodash";
import { Provider, Configuration } from "oidc-provider";
import { Logger } from "../../logger";

/* partial configuration which should be set by proxy */
type ProxyConfigurationKeys =
  // set lazily
  "adapter"
  |"findAccount"
  |"extraClientMetadata"
  |"extraParams"
  |"interactions"
  |"renderError"
  |"logoutSource"
  |"postLogoutSuccessSource"
  // not support static clients, claims, scopes definition to support distributed environment
  |"clients"
  |"claims"
  |"scopes"
  |"dynamicScopes";

type DeviceFlowConfigurationKeys = "userCodeInputSource" | "userCodeConfirmSource" | "successSource";
type DeviceFlowConfiguration = Required<Required<Configuration>["features"]>["deviceFlow"];
type ProxyDeviceFlowConfiguration = {
  features: {
    deviceFlow: { [key in DeviceFlowConfigurationKeys]: DeviceFlowConfiguration[key]; };
  };
};


export type ProxyConfiguration = Pick<Configuration, ProxyConfigurationKeys> & ProxyDeviceFlowConfiguration;

/* partial configuration which should be set statically */
export type StaticConfiguration = Omit<Configuration,
  ProxyConfigurationKeys

  // define discovery metadata
  |"discovery"
  > & {
  discovery?: OIDCProviderDiscoveryMetadata;

  // mandatory options.. but missing in original Configuration
  dev?: boolean;
  issuer?: string;
  trustProxy?: boolean;
}

export interface OIDCProviderDiscoveryMetadata {
  display_values_supported?: string[];
  claim_types_supported?: string[];
  claims_locales_supported?: string[];
  ui_locales_supported?: string[];
  op_tos_uri?: string | null;
  op_policy_uri?: string | null;
  service_documentation?: string | null;
}

export type OIDCProviderProxyConfigBuilderProps = {
  logger: Logger;
};

export function getProviderAndProxyConfiguration(props: OIDCProviderProxyConfigBuilderProps, opts: Partial<StaticConfiguration> = {}) {
  // arrange initial opts
  const { logger } = props;
  const { issuer, trustProxy, dev, partialStaticConfig } = (_opts => {
    // tslint:disable-next-line:no-shadowed-variable
    const { issuer = "http://localhost:9090", trustProxy = true, dev = false, ...partialStaticConfig } = _opts;
    return {
      issuer,
      trustProxy,
      dev: dev || issuer.startsWith("http://"),
      partialStaticConfig,
    }
  })(opts);

  // merge static options
  const staticConfig: StaticConfiguration = _.defaultsDeep(partialStaticConfig, defaultStaticConfig);

  // link some options to proxy sources
  const proxyConfigSource: ProxyConfiguration = {
    adapter: undefined as any,
    findAccount: undefined as any,
    extraClientMetadata: undefined as any,
    extraParams: undefined as any,
    interactions: undefined as any,
    features: {
      deviceFlow: {
        userCodeConfirmSource: undefined as any,
        userCodeInputSource: undefined as any,
        successSource: undefined as any,
      },
    },
  };

  staticConfig!.features!.deviceFlow = new Proxy<DeviceFlowConfiguration>(staticConfig.features!.deviceFlow!, {
    get(target, prop: keyof DeviceFlowConfiguration) {
      const value = (proxyConfigSource.features.deviceFlow as DeviceFlowConfiguration)[prop];
      return typeof value !== "undefined" ? value : target[prop];
    }
  });

  const configProxy: Configuration = new Proxy<Configuration>(staticConfig, {
    get(target, prop: keyof Configuration) {
      switch (prop) {
        // not support static clients, claims, scopes definition to support distributed environment
        case "clients":
        case "claims":
        case "scopes":
          return undefined;
        case "dynamicScopes":
          return [/.+/];

        // pass to options!.features first to refer options.features.deviceFlow proxy
        case "features":
          return target.features;
      }
      const value = (proxyConfigSource as Configuration)[prop];
      return typeof value !== "undefined" ? value : target[prop];
    },
  });

  // create provider with config proxy
  const provider = new Provider(issuer, configProxy);
  provider.env = "production";
  provider.proxy = trustProxy;

  // ref: https://github.com/panva/node-oidc-provider/tree/master/recipes#oidc-provider-recipes
  if (dev) {
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

  // delegate programmable implementation to OIDCProviderProxy now
  return { provider, config: proxyConfigSource };
}

const defaultStaticConfig: StaticConfiguration = {
  discovery: {
    claim_types_supported: [
      "normal",
    ],
    claims_locales_supported: ["en-US"],
    ui_locales_supported: ["en-US"],
    display_values_supported: ["page", "popup"],
    op_tos_uri: null,
    op_policy_uri: null,
    service_documentation: null,
  },

  // details
  cookies: {
    short: {
      path: "/",
      maxAge: 1000 * 60 * 60 * 24,
    },
    long: {
      path: "/",
      maxAge: 1000 * 60 * 60 * 24 * 28,
    },
  },

  routes: {
    jwks: "/oidc/jwks",
    authorization: "/oidc/auth",
    pushed_authorization_request: "/oidc/request",
    check_session: "/oidc/session/check",
    end_session: "/oidc/session/end",
    code_verification: "/oidc/device",
    device_authorization: "/oidc/device/auth",
    token: "/oidc/token",
    introspection: "/oidc/token/introspect",
    revocation: "/oidc/token/revoke",
    userinfo: "/oidc/userinfo",
    registration: "/oidc/client/register",
  },

  // ref: https://github.com/panva/node-oidc-provider/blob/master/docs/README.md
  features: {
    // token issue and management features
    userinfo: {enabled: true},
    introspection: {enabled: true},
    revocation: {enabled: true},
    backchannelLogout: {enabled: true},
    frontchannelLogout: {enabled: true},
    sessionManagement: {enabled: true},
    webMessageResponseMode: {enabled: true},
    deviceFlow: {enabled: true},

    // dynamic client registration
    registration: {enabled: true},
    registrationManagement: {enabled: true},

    // turn off development feature which composes dummy interactions
    // TODO: devInteractions: ({enabled: false}) as never,
  },

  responseTypes: [
    "code", // authorization flow
    "id_token", "id_token token", // implicit flow
    "code id_token", "code token", "code id_token token", // hybrid flow
    "none",
  ],

  subjectTypes: [
    "public",
    "pairwise",
  ],

  pairwiseIdentifier(ctx, sub, client) {
    return crypto.createHash("sha256")
      .update(client.sectorIdentifier)
      .update(sub)
      .digest("hex");
  },

  pkceMethods: [
    "S256",
    "plain",
  ],

  clientDefaults: {
    grant_types: ["implicit", "authorization_code", "refresh_token"],
    response_types: ["code", "id_token", "id_token token", "code id_token", "code token", "code id_token token", "none"],
    token_endpoint_auth_method: "none",
  },
};

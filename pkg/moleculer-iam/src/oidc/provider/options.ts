import * as _ from "lodash";
import * as kleur from "kleur";
import crypto from "crypto";
import mount from "koa-mount";
import { IdentityClaimsSchema, IdentityProvider } from "../../identity";
import { Logger } from "../../logger";
import { Provider, Configuration, errors, ClientMetadata, Client } from "./types";
import { OIDCAdapter, OIDCAdapterConstructorOptions, OIDCAdapterConstructors } from "../adapter";
import { InteractionFactory, InteractionFactoryOptions } from "../interaction";

// ref: https://github.com/panva/node-oidc-provider/blob/9306f66bdbcdff01400773f26539cf35951b9ce8/lib/models/client.js#L385
// @ts-ignore : need to hack oidc-provider private methods
import getProviderHiddenProps from "oidc-provider/lib/helpers/weak_cache";

export interface OIDCProviderDiscoveryMetadata {
  display_values_supported?: string[];
  claim_types_supported?: string[];
  claims_locales_supported?: string[];
  ui_locales_supported?: string[];
  op_tos_uri?: string | null;
  op_policy_uri?: string | null;
  service_documentation?: string | null;
}

export type OIDCProviderOptions = Omit<Configuration, "adapter"|"claims"|"scopes"|"findAccount"|"dynamicScopes"|"interactions"|"discovery"|"client"> & {
  issuer: string;
  trustProxy?: boolean;
  devMode?: boolean;
  adapter?: OIDCAdapterConstructorOptions;
  interaction?: InteractionFactoryOptions;
  discovery?: OIDCProviderDiscoveryMetadata;
}

export const defaultOIDCProviderOptions: OIDCProviderOptions = {
  // mandatory config
  issuer: "http://localhost:8080",
  adapter: {
    type: "Memory",
    options: {},
  },
  trustProxy: true,
  dev: false,

  // metadata
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
    /* token issue and management features */
    userinfo: {enabled: true},
    introspection: {enabled: true},
    revocation: {enabled: true},
    backchannelLogout: {enabled: true},
    frontchannelLogout: {enabled: true},
    sessionManagement: {enabled: true},
    webMessageResponseMode: {enabled: true},
    deviceFlow: {enabled: true},

    /* dynamic client registration */
    registration: {enabled: true},
    registrationManagement: {enabled: true},

    /* turn off development feature which composes dummy interactions */
    devInteractions: ({enabled: false}) as never,
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

export const parseOIDCProviderOptions = (
  props: {
    logger: Logger;
    idp: IdentityProvider;
  },
  opts: OIDCProviderOptions,
): {
  methods: {
    // ref: https://github.com/panva/node-oidc-provider/blob/9306f66bdbcdff01400773f26539cf35951b9ce8/lib/models/client.js#L385
    configuration: () => Configuration;
    clientAdd: (metadata: Partial<ClientMetadata>, opt: { store: true }) => Client;
    clientRemove: (id: string) => void;
  };
  syncSupportedClaimsAndScopes: (claimsSchemata: IdentityClaimsSchema[]) => void;
  routes: ReturnType<typeof mount>;
  adapter: OIDCAdapter;
  devModeEnabled: boolean;
  issuer: string;
} => {
  const { logger, idp } = props;

  // apply default options
  const { issuer, trustProxy, devMode, interaction, ...config } = _.defaultsDeep(opts, defaultOIDCProviderOptions) as OIDCProviderOptions;
  const devModeEnabled = !!(devMode || issuer.startsWith("http://"));

  // create provider adapter
  const adapterKey: keyof (typeof OIDCAdapterConstructors) = Object.keys(OIDCAdapterConstructors).find(k => k.toLowerCase() === opts.adapter!.type.toLowerCase())
    || Object.keys(OIDCAdapterConstructors)[0] as any;
  const adapter = new OIDCAdapterConstructors[adapterKey]({
    logger,
  }, opts.adapter!.options);

  // create interaction configuration factory
  const interactionFactory = new InteractionFactory({
    logger,
    idp,
    devModeEnabled,
    metadata: config.discovery!,
  }, interaction);

  // create original provider
  const mandatoryConfig: Configuration = {
    // support extra params for /auth?change_account=true&blabla to not auto-fill signed in session account
    extraParams: ["change_account"],

    // persistent storage for OP
    adapter: adapter.originalAdapterProxy,
    ...interactionFactory.configuration(),

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
    async findAccount(ctx, id, token?) {
      // token is a reference to the token used for which a given account is being loaded,
      // it is undefined in scenarios where account claims are returned from authorization endpoint
      // ctx is the koa request context
      return idp.findOrFail({id})
        .catch(async err => {
          await ctx.oidc.session.destroy();
          throw err;
        });
    },
  };
  const mergedConfig = _.defaultsDeep(mandatoryConfig, config);
  logger.debug("openid-provider configuration:", mergedConfig, interactionFactory.configuration());
  const provider = new Provider(issuer, mergedConfig);
  provider.env = "production";
  provider.proxy = trustProxy !== false;

  // mount interaction routes
  provider.app.use(interactionFactory.routes(provider));

  // create merged routes
  const routes = mount(provider.app as any);

  // apply debugging features
  if (devModeEnabled) {
    applyDebugOptions(provider, logger, {
      "disable-implicit-forbid-localhost": true,
      "disable-implicit-force-https": true,
    });
  }

  // get hidden props
  const methods = getProviderHiddenProps(provider);

  // set supported option (hacky)
  // ref: https://github.com/panva/node-oidc-provider/blob/ae8a4589c582b96f4e9ca0432307da15792ac29d/lib/helpers/claims.js#L54
  function syncSupportedClaimsAndScopes(claimsSchemata: IdentityClaimsSchema[]) {
    // set supported claims (hacky)
    const dynamicConfig = methods.configuration() as any;
    const claimsFilter = dynamicConfig.claims as Map<string, null | { [claim: string]: any }>;
    const claimsSupported = dynamicConfig.claimsSupported as Set<string>;
    claimsSchemata.forEach(schema => {
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

    // set supported scopes (also hacky)
    const scopes = dynamicConfig.scopes as Set<string>;
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
    logger.info(`available claims for each scopes has been updated:\n${
      [...claimsFilter.entries()]
        .map(([scope, claims]) => {
          return claims
            ? `${kleur.green(scope.padEnd(20))}: ${kleur.white(Object.keys(claims).join(", "))}`
            : `${kleur.green().dim("(token)".padEnd(20))}: ${kleur.dim(scope)}`;
        })
        .join("\n")
    }`);
  }

  return {
    methods,
    devModeEnabled,
    issuer,
    adapter,
    routes,
    syncSupportedClaimsAndScopes,
  }
};

export type OIDCProviderDebugOptions = {
  [key in "disable-implicit-force-https" | "disable-implicit-forbid-localhost"]: boolean;
};

// it makes side-effects for provider
// ref: https://github.com/panva/node-oidc-provider/tree/master/recipes#oidc-provider-recipes
export function applyDebugOptions(provider: Provider, logger: Logger, options: OIDCProviderDebugOptions) {

  // extend client schema validation
  if (options["disable-implicit-force-https"] || options["disable-implicit-forbid-localhost"]) {
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
}

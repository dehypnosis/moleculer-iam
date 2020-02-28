"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const _ = tslib_1.__importStar(require("lodash"));
const kleur = tslib_1.__importStar(require("kleur"));
const crypto_1 = tslib_1.__importDefault(require("crypto"));
const koa_mount_1 = tslib_1.__importDefault(require("koa-mount"));
const types_1 = require("./types");
const adapter_1 = require("../adapter");
const interaction_1 = require("../interaction");
// ref: https://github.com/panva/node-oidc-provider/blob/9306f66bdbcdff01400773f26539cf35951b9ce8/lib/models/client.js#L385
// @ts-ignore : need to hack oidc-provider private methods
const weak_cache_1 = tslib_1.__importDefault(require("oidc-provider/lib/helpers/weak_cache"));
exports.defaultOIDCProviderOptions = {
    // mandatory config
    issuer: "http://localhost:8080",
    adapter: {
        type: "Memory",
        options: {},
    },
    trustProxy: true,
    devMode: false,
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
        userinfo: { enabled: true },
        introspection: { enabled: true },
        revocation: { enabled: true },
        backchannelLogout: { enabled: true },
        frontchannelLogout: { enabled: true },
        sessionManagement: { enabled: true },
        webMessageResponseMode: { enabled: true },
        deviceFlow: { enabled: true },
        /* dynamic client registration */
        registration: { enabled: true },
        registrationManagement: { enabled: true },
        /* turn off development feature which composes dummy interactions */
        devInteractions: ({ enabled: false }),
    },
    responseTypes: [
        "code",
        "id_token", "id_token token",
        "code id_token", "code token", "code id_token token",
        "none",
    ],
    subjectTypes: [
        "public",
        "pairwise",
    ],
    pairwiseIdentifier(ctx, sub, client) {
        return crypto_1.default.createHash("sha256")
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
exports.parseOIDCProviderOptions = (props, opts) => {
    const { logger, idp } = props;
    // apply default options
    const { issuer, trustProxy, devMode, interaction, ...config } = _.defaultsDeep(opts, exports.defaultOIDCProviderOptions);
    const devModeEnabled = !!(devMode || issuer.startsWith("http://"));
    // create provider adapter
    const adapterKey = Object.keys(adapter_1.OIDCAdapterConstructors).find(k => k.toLowerCase() === opts.adapter.type.toLowerCase())
        || Object.keys(adapter_1.OIDCAdapterConstructors)[0];
    const adapter = new adapter_1.OIDCAdapterConstructors[adapterKey]({
        logger,
    }, opts.adapter.options);
    // create interaction configuration factory
    const interactionFactory = new interaction_1.InteractionFactory({
        logger,
        idp,
        devModeEnabled,
        metadata: config.discovery,
    }, interaction);
    // create original provider
    const mandatoryConfig = {
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
                        throw new types_1.errors.InvalidClientMetadata("unknown client property: " + k);
                }
            },
        },
        // bridge between IDP and OP
        async findAccount(ctx, id, token) {
            // token is a reference to the token used for which a given account is being loaded,
            // it is undefined in scenarios where account claims are returned from authorization endpoint
            // ctx is the koa request context
            return idp.findOrFail({ id })
                .catch(async (err) => {
                await ctx.oidc.session.destroy();
                throw err;
            });
        },
    };
    const mergedConfig = _.defaultsDeep(mandatoryConfig, config);
    logger.debug("openid-provider configuration:", mergedConfig, interactionFactory.configuration());
    const provider = new types_1.Provider(issuer, mergedConfig);
    provider.env = "production";
    provider.proxy = trustProxy !== false;
    // mount interaction routes
    provider.app.use(interactionFactory.routes(provider));
    // create merged routes
    const routes = koa_mount_1.default(provider.app);
    // apply debugging features
    if (devModeEnabled) {
        applyDebugOptions(provider, logger, {
            "disable-implicit-forbid-localhost": true,
            "disable-implicit-force-https": true,
        });
    }
    // get hidden props
    const methods = weak_cache_1.default(provider);
    // set supported option (hacky)
    // ref: https://github.com/panva/node-oidc-provider/blob/ae8a4589c582b96f4e9ca0432307da15792ac29d/lib/helpers/claims.js#L54
    function syncSupportedClaimsAndScopes(claimsSchemata) {
        // set supported claims (hacky)
        const dynamicConfig = methods.configuration();
        const claimsFilter = dynamicConfig.claims;
        const claimsSupported = dynamicConfig.claimsSupported;
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
        const scopes = dynamicConfig.scopes;
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
        logger.info(`available claims for each scopes has been updated:\n${[...claimsFilter.entries()]
            .map(([scope, claims]) => {
            return claims
                ? `${kleur.green(scope.padEnd(20))}: ${kleur.white(Object.keys(claims).join(", "))}`
                : `${kleur.green().dim("(token)".padEnd(20))}: ${kleur.dim(scope)}`;
        })
            .join("\n")}`);
    }
    return {
        methods,
        devModeEnabled,
        issuer,
        adapter,
        routes,
        syncSupportedClaimsAndScopes,
    };
};
// it makes side-effects for provider
// ref: https://github.com/panva/node-oidc-provider/tree/master/recipes#oidc-provider-recipes
function applyDebugOptions(provider, logger, options) {
    // extend client schema validation
    if (options["disable-implicit-force-https"] || options["disable-implicit-forbid-localhost"]) {
        // @ts-ignore
        const invalidateClientSchema = provider.Client.Schema.prototype.invalidate;
        // @ts-ignore
        provider.Client.Schema.prototype.invalidate = function (message, code) {
            if (code === "implicit-force-https" || code === "implicit-forbid-localhost") {
                logger.warn(`ignore error ${kleur.red(code)} for debugging purpose in client ${kleur.cyan(this.client_id)} schema validation`);
                return;
            }
            invalidateClientSchema.call(this, message);
        };
    }
}
exports.applyDebugOptions = applyDebugOptions;
//# sourceMappingURL=options.js.map
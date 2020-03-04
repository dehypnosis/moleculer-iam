"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const kleur = tslib_1.__importStar(require("kleur"));
const _ = tslib_1.__importStar(require("lodash"));
const oidc_provider_1 = require("oidc-provider");
const adapter_1 = require("./adapter");
const config_default_1 = require("./config.default");
const interaction_1 = require("./interaction");
class ProviderConfigBuilder {
    constructor(props, opts = {}) {
        this.props = props;
        this.built = false;
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
            });
            const adapterKey = Object.keys(adapter_1.OIDCAdapterProxyConstructors).find(k => k.toLowerCase() === adapterConfig.type.toLowerCase())
                || Object.keys(adapter_1.OIDCAdapterProxyConstructors)[0];
            const adapterInstance = new adapter_1.OIDCAdapterProxyConstructors[adapterKey]({
                logger,
            }, adapterConfig.options);
            return {
                issuer,
                dev: dev || issuer.startsWith("http://"),
                adapter: adapterInstance,
                partialStaticConfig,
            };
        })(opts);
        this.issuer = issuer;
        this.dev = dev;
        this.adapter = adapter;
        // create interaction builder
        this.interaction = new interaction_1.ProviderInteractionBuilder(this);
        // create static config
        this.staticConfig = _.defaultsDeep({
            // set adapter constructor
            adapter: adapter.adapterConstructorProxy,
            // set unsupported static clients, claims, scopes definition to support distributed environment
            clients: undefined,
            claims: undefined,
            scopes: undefined,
            dynamicScopes: [/.+/],
        }, partialStaticConfig, config_default_1.defaultStaticConfig);
        // create dynamic config which are linked to interaction builder
        this.dynamicConfig = _.defaultsDeep(this.interaction._dangerouslyGetDynamicConfiguration(), {
            // bridge for IDP and OP session
            findAccount: (ctx, id, token) => {
                return idp.findOrFail({ id })
                    .catch(async (err) => {
                    await ctx.oidc.session.destroy();
                    throw err;
                });
            },
            extraClientMetadata: undefined,
            extraParams: undefined,
            routes: undefined,
        });
    }
    _dagerouslyGetProvider() {
        return this.provider;
    }
    setPrefix(prefix) {
        this.assertBuilding();
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
        this.logger.info(`named route path configured:`, this.dynamicConfig.routes);
        // set interaction router prefix
        this.interaction._dangerouslySetPrefix(prefix);
        return this;
    }
    setExtraParams(config) {
        this.assertBuilding();
        this.dynamicConfig.extraParams = config;
        return this;
    }
    setExtraClientMetadata(config) {
        this.assertBuilding();
        this.dynamicConfig.extraClientMetadata = config;
        return this;
    }
    assertBuilding(shouldBuilt = false) {
        if (!shouldBuilt && this.built) {
            throw new Error("provider configuration already built");
        }
        else if (shouldBuilt && !this.built) {
            throw new Error("provider configuration has not been built yet");
        }
    }
    _dangerouslyBuild() {
        this.assertBuilding();
        const { logger } = this;
        // create provider with config proxy
        const provider = this.provider = new oidc_provider_1.Provider(this.issuer, _.defaultsDeep(this.dynamicConfig, this.staticConfig));
        // provider.env = "production";
        // provider.proxy = true; // trust http proxy header
        // ref: https://github.com/panva/node-oidc-provider/tree/master/recipes#oidc-provider-recipes
        if (this.dev) {
            ((features) => {
                // extend client schema validation
                if (features["disable-implicit-force-https"] || features["disable-implicit-forbid-localhost"]) {
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
            })({
                "disable-implicit-forbid-localhost": true,
                "disable-implicit-force-https": true,
            });
        }
        // mount interaction routes
        this.interaction._dangerouslyBuild();
        this.built = true;
        return provider;
    }
}
exports.ProviderConfigBuilder = ProviderConfigBuilder;
//# sourceMappingURL=config.js.map
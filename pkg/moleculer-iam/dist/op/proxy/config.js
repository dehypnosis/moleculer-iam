"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const kleur = tslib_1.__importStar(require("kleur"));
const _ = tslib_1.__importStar(require("lodash"));
const oidc_provider_1 = require("oidc-provider");
const adapter_1 = require("./adapter");
const config_default_1 = require("./config.default");
const config_interaction_1 = require("./config.interaction");
class ProviderConfigBuilder {
    constructor(props, opts = {}) {
        this.props = props;
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
        this.interaction = new config_interaction_1.ProviderInteractionBuilder({
            logger,
            idp,
            getProvider: () => this.provider,
        });
        this.staticConfig = _.defaultsDeep({
            // set adapter constructor
            adapter: adapter.adapterConstructorProxy,
            // set unsupported static clients, claims, scopes definition to support distributed environment
            clients: undefined,
            claims: undefined,
            scopes: undefined,
            dynamicScopes: [/.+/],
        }, partialStaticConfig, config_default_1.defaultStaticConfig);
        // create dynamic options
        const { deviceFlowUserCodeInputSourceProxy, deviceFlowUserCodeConfirmSourceProxy, deviceFlowSuccessSourceProxy, renderErrorProxy, logoutSourceProxy, postLogoutSuccessSourceProxy, } = this.interaction.namedRoutesProxy;
        this.dynamicConfig = {
            findAccount: undefined,
            extraClientMetadata: undefined,
            extraParams: undefined,
            interactions: undefined,
            routes: undefined,
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
        };
    }
    setPrefix(prefix) {
        // set interaction url
        this.dynamicConfig.interactions = {
            ...this.dynamicConfig.interactions,
            url: (ctx, interaction) => {
                return `${prefix}/${interaction.prompt.name}`;
            },
        };
        this.logger.info(`interaction url generation rule configured:`, `${prefix}/:interaction-prompt-name`);
        // set interaction router prefix
        this.interaction.router.prefix(prefix);
        this.logger.info(`interaction router path configured:`, `${prefix}/:routes`);
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
    setFindAccount(config) {
        this.dynamicConfig.findAccount = config;
        return this;
    }
    setExtraParams(config) {
        this.dynamicConfig.extraParams = config;
        return this;
    }
    setExtraClientMetadata(config) {
        this.dynamicConfig.extraClientMetadata = config;
        return this;
    }
    setInteractionPolicy(config) {
        this.dynamicConfig.interactions = {
            ...this.dynamicConfig.interactions,
            policy: config,
        };
        return this;
    }
    build() {
        const { logger } = this;
        // create provider with config proxy
        const provider = this.provider = new oidc_provider_1.Provider(this.issuer, _.defaultsDeep(this.dynamicConfig, this.staticConfig));
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
        this.interaction.build();
        // delegate programmable implementation to OIDCProviderProxy now
        return provider;
    }
}
exports.ProviderConfigBuilder = ProviderConfigBuilder;
//# sourceMappingURL=config.js.map
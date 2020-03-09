"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const kleur = tslib_1.__importStar(require("kleur"));
const accept_language_parser_1 = require("accept-language-parser");
const app_1 = require("../app");
const config_1 = require("./config");
// ref: https://github.com/panva/node-oidc-provider/blob/9306f66bdbcdff01400773f26539cf35951b9ce8/lib/models/client.js#L385
// @ts-ignore : need to hack oidc-provider private methods
const weak_cache_1 = tslib_1.__importDefault(require("oidc-provider/lib/helpers/weak_cache"));
class OIDCProviderProxy {
    constructor(props, options) {
        this.props = props;
        const { logger, idp } = props;
        this.logger = logger;
        // apply static options and get the provider instance and proxy config which can be set dynamically
        const { app, ...staticConfig } = options;
        const builder = new config_1.ProviderConfigBuilder({
            logger,
            idp,
        }, staticConfig);
        // build main logic with options
        app_1.buildApplication(builder, app);
        // create provider and adapter
        this.provider = builder._dangerouslyBuild();
        this.adapter = builder.adapter;
    }
    get hidden() {
        return weak_cache_1.default(this.provider);
    }
    // http handler application (Koa)
    get app() {
        return this.provider.app;
    }
    get configuration() {
        return this.hidden.configuration();
    }
    get supportedLocales() {
        return this.configuration.discovery.ui_locales_supported || [];
    }
    parseLocale(locale) {
        const locales = this.supportedLocales;
        const raw = accept_language_parser_1.pick(locales, locale || "", { loose: true }) || locales[0] || "ko-KR";
        const [language, country] = raw.split("-");
        const [_, requestCountry] = (locale || "").split("-"); // request locale country will take precedence over matched one
        return { language: language || "ko", country: requestCountry || country || "KR" };
    }
    get issuer() {
        return this.provider.issuer;
    }
    start() {
        return this.adapter.start();
    }
    stop() {
        return this.adapter.stop();
    }
    // programmable interfaces
    deleteModels(...args) {
    }
    countModels(...args) {
        return 10;
    }
    // set supported claims and scopes (hacky)
    // ref: https://github.com/panva/node-oidc-provider/blob/ae8a4589c582b96f4e9ca0432307da15792ac29d/lib/helpers/claims.js#L54
    syncSupportedClaimsAndScopes(defs) {
        const config = this.configuration;
        const claimsFilter = config.claims;
        const claimsSupported = config.claimsSupported;
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
        const scopes = config.scopes;
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
        this.logger.info(`available claims for each scopes has been updated:\n${[...claimsFilter.entries()]
            .map(([scope, claims]) => {
            return claims
                ? `${kleur.green(scope.padEnd(20))}: ${kleur.white(Object.keys(claims).join(", "))}`
                : `${kleur.green().dim("(token)".padEnd(20))}: ${kleur.dim(scope)}`;
        })
            .join("\n")}`);
    }
}
exports.OIDCProviderProxy = OIDCProviderProxy;
//# sourceMappingURL=proxy.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const kleur = tslib_1.__importStar(require("kleur"));
const uuid_1 = tslib_1.__importDefault(require("uuid"));
const accept_language_parser_1 = require("accept-language-parser");
const app_1 = require("../app");
const config_1 = require("./config");
const error_types_1 = require("./error.types");
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
    get Session() {
        return this.adapter.getModel("Session");
    }
    get AccessToken() {
        return this.adapter.getModel("AccessToken");
    }
    get AuthorizationCode() {
        return this.adapter.getModel("AuthorizationCode");
    }
    get RefreshToken() {
        return this.adapter.getModel("RefreshToken");
    }
    get DeviceCode() {
        return this.adapter.getModel("DeviceCode");
    }
    get ClientCredentials() {
        return this.adapter.getModel("ClientCredentials");
    }
    get Client() {
        return this.adapter.getModel("Client");
    }
    get InitialAccessToken() {
        return this.adapter.getModel("InitialAccessToken");
    }
    get RegistrationAccessToken() {
        return this.adapter.getModel("RegistrationAccessToken");
    }
    get Interaction() {
        return this.adapter.getModel("Interaction");
    }
    get ReplayDetection() {
        return this.adapter.getModel("ReplayDetection");
    }
    get PushedAuthorizationRequest() {
        return this.adapter.getModel("PushedAuthorizationRequest");
    }
    async findClient(id) {
        return this.Client.find(id);
    }
    async findClientOrFail(id) {
        const client = await this.findClient(id);
        if (!client) {
            throw new error_types_1.OIDCErrors.InvalidClient("client_not_found");
        }
        return client;
    }
    async createClient(metadata) {
        if (metadata.client_id && await this.findClient(metadata.client_id)) {
            throw new error_types_1.OIDCErrors.InvalidClient("client_id_duplicated");
        }
        this.logger.info(`create client ${kleur.cyan(metadata.client_id)}:`, metadata);
        const client = await this.hidden.clientAdd({
            ...metadata,
            client_secret: OIDCProviderProxy.generateClientSecret(),
        }, { store: true });
        return client.metadata();
    }
    async updateClient(metadata) {
        const old = await this.findClient(metadata.client_id);
        // update client_secret
        if (metadata.reset_client_secret === true) {
            metadata = {
                ...metadata,
                client_secret: OIDCProviderProxy.generateClientSecret(),
            };
            delete metadata.reset_client_secret;
        }
        this.logger.info(`update client ${kleur.cyan(metadata.client_id || "<unknown>")}:`, require("util").inspect(metadata));
        const client = await this.hidden.clientAdd({
            ...old,
            ...metadata,
        }, { store: true });
        return client.metadata();
    }
    async deleteClient(id) {
        await this.findClientOrFail(id);
        this.logger.info(`delete client ${kleur.cyan(id)}`);
        this.hidden.clientRemove(id);
    }
    async getClients(args) {
        return this.Client.get(args);
    }
    async countClients(args) {
        return this.Client.count(args);
    }
    static generateClientSecret() {
        return uuid_1.default().replace(/\-/g, "") + uuid_1.default().replace(/\-/g, "");
    }
    async countModels(kind, args) {
        const model = this.adapter.getModel(kind);
        return model.count(args);
    }
    async getModels(kind, args) {
        const model = this.adapter.getModel(kind);
        return model.get(args);
    }
    async deleteModels(kind, args) {
        const model = this.adapter.getModel(kind);
        return model.delete(args);
    }
    async syncSupportedClaimsAndScopes() {
        // set available scopes and claims
        const claimsSchemata = await this.props.idp.claims.getActiveClaimsSchemata();
        this.updateSupportedClaimsAndScopes(claimsSchemata);
    }
    // set supported claims and scopes (hacky)
    // ref: https://github.com/panva/node-oidc-provider/blob/ae8a4589c582b96f4e9ca0432307da15792ac29d/lib/helpers/claims.js#L54
    updateSupportedClaimsAndScopes(defs) {
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
OIDCProviderProxy.volatileModelNames = [
    "Session",
    "AccessToken",
    "AuthorizationCode",
    "RefreshToken",
    "DeviceCode",
    "InitialAccessToken",
    "RegistrationAccessToken",
    "Interaction",
    "ReplayDetection",
    "PushedAuthorizationRequest",
];
//# sourceMappingURL=proxy.js.map
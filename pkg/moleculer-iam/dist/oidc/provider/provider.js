"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const kleur = tslib_1.__importStar(require("kleur"));
const _ = tslib_1.__importStar(require("lodash"));
const koa_mount_1 = tslib_1.__importDefault(require("koa-mount"));
const uuid_1 = tslib_1.__importDefault(require("uuid"));
const interaction_1 = require("../interaction");
const types_1 = require("./types");
const adapter_1 = require("../adapter");
const options_1 = require("./options");
const debug_1 = require("./debug");
// @ts-ignore : need to hack oidc-provider private methods
const weak_cache_1 = tslib_1.__importDefault(require("oidc-provider/lib/helpers/weak_cache"));
class OIDCProvider {
    constructor(props, options) {
        this.props = props;
        /* lifecycle */
        this.working = false;
        const idp = props.idp;
        const logger = this.logger = props.logger || console;
        const _a = _.defaultsDeep(options || {}, options_1.defaultOIDCProviderOptions), { issuer, trustProxy, adapter, devMode } = _a, providerConfig = tslib_1.__rest(_a, ["issuer", "trustProxy", "adapter", "devMode"]);
        const devModeEnabled = this.devModeEnabled = !!(devMode || issuer.startsWith("http://"));
        /* create provider adapter */
        const adapterKey = Object.keys(adapter_1.OIDCAdapterConstructors).find(k => k.toLowerCase() === options.adapter.type.toLowerCase())
            || Object.keys(adapter_1.OIDCAdapterConstructors)[0];
        this.adapter = new adapter_1.OIDCAdapterConstructors[adapterKey]({
            logger,
        }, options.adapter.options);
        /* create provider interactions */
        const interactionFactory = new interaction_1.InteractionFactory({
            logger,
            idp,
        }, { federation: options.federation, render: options.render, devModeEnabled });
        /* create original provider */
        const config = _.defaultsDeep(Object.assign({ 
            // persistent storage for OP
            adapter: this.adapter.originalAdapterProxy, 
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
            findAccount(ctx, id, token) {
                return tslib_1.__awaiter(this, void 0, void 0, function* () {
                    // token is a reference to the token used for which a given account is being loaded,
                    // it is undefined in scenarios where account claims are returned from authorization endpoint
                    // ctx is the koa request context
                    return idp.findOrFail({ id })
                        .catch((err) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                        yield ctx.oidc.session.destroy();
                        throw err;
                    }));
                });
            } }, interactionFactory.configuration()), providerConfig);
        const original = this.original = new types_1.Provider(issuer, config);
        original.env = "production";
        original.proxy = trustProxy !== false;
        // mount interaction routes
        original.app.use(interactionFactory.routes(original));
        // apply debugging features
        if (devModeEnabled) {
            debug_1.applyDebugOptions(original, logger, {
                "disable-implicit-forbid-localhost": true,
                "disable-implicit-force-https": true,
            });
        }
    }
    get idp() {
        return this.props.idp;
    }
    get routes() {
        return koa_mount_1.default(this.original.app);
    }
    get originalHiddenProps() {
        return weak_cache_1.default(this.original);
    }
    get config() {
        return this.originalHiddenProps.configuration();
    }
    get defaultRoutes() {
        return Object.assign({ discovery: "/.well-known/openid-configuration", interaction: "/interaction" }, this.config.routes);
    }
    get discoveryPath() {
        return `/.well-known/openid-configuration`;
    }
    get issuer() {
        return this.original.issuer;
    }
    start() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this.working) {
                return;
            }
            // start idp
            yield this.idp.start();
            yield this.syncSupportedClaimsAndScopes();
            // start adapter
            yield this.adapter.start();
            this.working = true;
            this.logger.info(`oidc provider has been started`);
            this.logger.info(`available oidc endpoints:\n${[...Object.entries(this.defaultRoutes)]
                .map(([key, path]) => {
                return `${kleur.green(key.padEnd(30))}: ${kleur.cyan(`${this.issuer}${path || "/???"}`)}`;
            })
                .join("\n")}`);
        });
    }
    stop() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!this.working) {
                return;
            }
            // stop adapter
            yield this.adapter.stop();
            // stop idp
            yield this.idp.stop();
            this.working = false;
            this.logger.info(`oidc provider has been stopped`);
        });
    }
    /* client management */
    get Client() {
        return this.adapter.getModel("Client");
    }
    findClient(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.Client.find(id);
        });
    }
    findClientOrFail(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const client = yield this.findClient(id);
            if (!client) {
                throw new types_1.errors.InvalidClient("client_not_found");
            }
            return client;
        });
    }
    createClient(metadata) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (metadata.client_id && (yield this.findClient(metadata.client_id))) {
                throw new types_1.errors.InvalidClient("client_id_duplicated");
            }
            this.logger.info(`create client ${kleur.cyan(metadata.client_id)}:`, metadata);
            const client = yield this.originalHiddenProps.clientAdd(Object.assign(Object.assign({}, metadata), { client_secret: OIDCProvider.generateClientSecret() }), { store: true });
            return client.metadata();
        });
    }
    updateClient(metadata) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const old = yield this.findClient(metadata.client_id);
            // update client_secret
            if (metadata.reset_client_secret === true) {
                metadata = Object.assign(Object.assign({}, metadata), { client_secret: OIDCProvider.generateClientSecret() });
                delete metadata.reset_client_secret;
            }
            this.logger.info(`update client ${kleur.cyan(metadata.client_id || "<unknown>")}:`, require("util").inspect(metadata));
            const client = yield this.originalHiddenProps.clientAdd(Object.assign(Object.assign({}, old), metadata), { store: true });
            return client.metadata();
        });
    }
    deleteClient(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.findClientOrFail(id);
            this.logger.info(`delete client ${kleur.cyan(id)}`);
            this.originalHiddenProps.clientRemove(id);
        });
    }
    getClients(args) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.Client.get(args);
        });
    }
    countClients(args) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.Client.count(args);
        });
    }
    static generateClientSecret() {
        return uuid_1.default().replace(/\-/g, "") + uuid_1.default().replace(/\-/g, "");
    }
    countModels(kind, args) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const model = this.adapter.getModel(kind);
            return model.count(args);
        });
    }
    getModels(kind, args) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const model = this.adapter.getModel(kind);
            return model.get(args);
        });
    }
    deleteModels(kind, args) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const model = this.adapter.getModel(kind);
            return model.delete(args);
        });
    }
    /* dynamic claims and schema management */
    syncSupportedClaimsAndScopes() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            // set available scopes and claims
            const claimsSchemata = yield this.idp.claims.getActiveClaimsSchemata();
            // set supported option (hacky)
            // ref: https://github.com/panva/node-oidc-provider/blob/ae8a4589c582b96f4e9ca0432307da15792ac29d/lib/helpers/claims.js#L54
            const claimsFilter = this.config.claims;
            const claimsSupported = this.config.claimsSupported;
            claimsSchemata.forEach(schema => {
                let obj = claimsFilter.get(schema.scope);
                if (obj === null)
                    return;
                if (!obj) {
                    obj = {};
                    claimsFilter.set(schema.scope, obj);
                }
                obj[schema.key] = null;
                claimsSupported.add(schema.key);
            });
            // set supported scopes (also hacky)
            const scopes = this.config.scopes;
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
            this.logger.info(`available idp claims per scope:\n${[...claimsFilter.entries()]
                .map(([scope, claims]) => {
                return claims
                    ? `${kleur.green(scope.padEnd(20))}: ${kleur.white(Object.keys(claims).join(", "))}`
                    : `${kleur.green().dim("(token)".padEnd(20))}: ${kleur.dim(scope)}`;
            })
                .join("\n")}`);
        });
    }
}
exports.OIDCProvider = OIDCProvider;
/* "Session"|"AuthorizationCode"|"DeviceCode"|"AccessToken"|"RefreshToken"|"RegistrationAccessToken" management */
OIDCProvider.volatileModelNames = [
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
//# sourceMappingURL=provider.js.map
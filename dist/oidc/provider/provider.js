"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const kleur = tslib_1.__importStar(require("kleur"));
const _ = tslib_1.__importStar(require("lodash"));
const koa_mount_1 = tslib_1.__importDefault(require("koa-mount"));
const koa_compose_1 = tslib_1.__importDefault(require("koa-compose"));
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
        const _a = _.defaultsDeep(options || {}, options_1.defaultOIDCProviderOptions), { issuer, trustProxy, adapter, app, devMode } = _a, providerConfig = tslib_1.__rest(_a, ["issuer", "trustProxy", "adapter", "app", "devMode"]);
        const devModeEnabled = devMode || issuer.startsWith("http://");
        /* create provider adapter */
        const adapterKey = Object.keys(adapter_1.OIDCAdapterConstructors).find(k => k.toLowerCase() === options.adapter.type.toLowerCase())
            || Object.keys(adapter_1.OIDCAdapterConstructors)[0];
        this.adapter = new adapter_1.OIDCAdapterConstructors[adapterKey]({
            logger,
        }, options.adapter.options);
        /* create provider interactions factory and client app renderer */
        const clientAppOption = app || {};
        if (devModeEnabled) {
            logger.info("disable assets cache for debugging purpose");
            clientAppOption.assetsCacheMaxAge = 0;
        }
        const clientApp = this.clientApp = new interaction_1.ClientApplicationRenderer({
            logger,
        }, clientAppOption);
        const internalInteractionConfigFactory = new interaction_1.InternalInteractionConfigurationFactory({
            app: clientApp,
            logger,
            idp,
        });
        const interactionFactory = new interaction_1.InteractionFactory({
            app: clientApp,
            logger,
            idp,
        }, { federation: options.federation, devModeEnabled });
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
            }, 
            // interactions and configuration
            interactions: interactionFactory.interactions() }, internalInteractionConfigFactory.configuration()), providerConfig);
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
        /* prepare client app oidc client options */
        this.clientAppClientOptions = _.defaultsDeep(clientAppOption.client || {}, {
            client_id: issuer.replace("https://", "").replace("http://", "").replace(":", "-"),
            client_name: "Account Manager",
            client_uri: issuer,
            application_type: "web",
            policy_uri: `${issuer}/help/policy`,
            tos_uri: `${issuer}/help/tos`,
            logo_uri: undefined,
            redirect_uris: [...new Set([issuer].concat(devModeEnabled ? ["http://localhost:9191", "http://localhost:9090", "http://localhost:8080", "http://localhost:3000"] : []))],
            post_logout_redirect_uris: [issuer],
            frontchannel_logout_uri: `${issuer}`,
            frontchannel_logout_session_required: true,
            /* custom props */
            skip_consent: true,
        });
        /* create router */
        this.router = koa_compose_1.default([
            koa_mount_1.default(this.original.app),
            this.clientApp.router,
        ]);
    }
    get idp() {
        return this.props.idp;
    }
    get config() {
        return weak_cache_1.default(this.original).configuration();
    }
    get defaultRoutes() {
        return Object.assign({ discovery: "/.well-known/openid-configuration" }, this.config.routes);
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
            // assert app client
            try {
                yield this.client.create(this.clientAppClientOptions);
            }
            catch (err) {
                if (err.error === "invalid_client") {
                    try {
                        yield this.client.update(this.clientAppClientOptions);
                    }
                    catch (err) {
                        this.logger.error(err);
                    }
                }
                else {
                    this.logger.error(err);
                }
            }
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
    /* bind management methods */
    get client() {
        if (!this.clientMethods) {
            this.clientMethods = this.createClientMethods();
        }
        return this.clientMethods;
    }
    createClientMethods() {
        const provider = this;
        const originalMethods = weak_cache_1.default(provider.original);
        const model = this.adapter.getModel("Client");
        const methods = {
            find(id) {
                return tslib_1.__awaiter(this, void 0, void 0, function* () {
                    return model.find(id);
                });
            },
            findOrFail(id) {
                return tslib_1.__awaiter(this, void 0, void 0, function* () {
                    const client = yield this.find(id);
                    if (!client) {
                        throw new types_1.errors.InvalidClient("client_not_found");
                    }
                    return client;
                });
            },
            create(metadata) {
                return tslib_1.__awaiter(this, void 0, void 0, function* () {
                    if (metadata.client_id && (yield methods.find(metadata.client_id))) {
                        throw new types_1.errors.InvalidClient("client_id_duplicated");
                    }
                    provider.logger.info(`create client ${kleur.cyan(metadata.client_id)}:`, metadata);
                    const client = yield originalMethods.clientAdd(Object.assign(Object.assign({}, metadata), { client_secret: OIDCProvider.generateClientSecret() }), { store: true });
                    return client.metadata();
                });
            },
            update(metadata) {
                return tslib_1.__awaiter(this, void 0, void 0, function* () {
                    const old = yield methods.find(metadata.client_id);
                    // update client_secret
                    if (metadata.reset_client_secret === true) {
                        metadata = Object.assign(Object.assign({}, metadata), { client_secret: OIDCProvider.generateClientSecret() });
                        delete metadata.reset_client_secret;
                    }
                    provider.logger.info(`update client ${kleur.cyan(metadata.client_id || "<unknown>")}:`, require("util").inspect(metadata));
                    const client = yield originalMethods.clientAdd(Object.assign(Object.assign({}, old), metadata), { store: true });
                    return client.metadata();
                });
            },
            remove(id) {
                return tslib_1.__awaiter(this, void 0, void 0, function* () {
                    yield methods.findOrFail(id);
                    provider.logger.info(`remove client ${kleur.cyan(id)}`);
                    originalMethods.clientRemove(id);
                });
            },
            get(opts) {
                return tslib_1.__awaiter(this, void 0, void 0, function* () {
                    return yield model.get(opts);
                });
            },
            count() {
                return tslib_1.__awaiter(this, void 0, void 0, function* () {
                    return model.count();
                });
            },
        };
        return methods;
    }
    static generateClientSecret() {
        return uuid_1.default().replace(/\-/g, "") + uuid_1.default().replace(/\-/g, "");
    }
    // public updateScopes(scope: string, scopeClaimsSchema: ValidationSchema) {
    //   const scopes = new Set(this.config.scopes);
    //   const claimNamesForScopes = _.cloneDeep(this.config.claims);
    //
    //   // TODO: this.idp.updateCustomClaimsSchema
    // }
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
//# sourceMappingURL=provider.js.map
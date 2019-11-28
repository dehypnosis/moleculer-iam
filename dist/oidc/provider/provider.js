"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const kleur = tslib_1.__importStar(require("kleur"));
const _ = tslib_1.__importStar(require("lodash"));
const koa_mount_1 = tslib_1.__importDefault(require("koa-mount"));
const types_1 = require("./types");
const adapter_1 = require("../adapter");
const options_1 = require("./options");
const interaction_1 = require("../interaction");
const debug_1 = require("./debug");
// @ts-ignore : need to hack oidc-provider private methods
const weak_cache_1 = tslib_1.__importDefault(require("oidc-provider/lib/helpers/weak_cache"));
class OIDCProvider {
    constructor(props, options) {
        this.props = props;
        /* lifecycle */
        this.working = false;
        const logger = this.logger = props.logger || console;
        const _a = _.defaultsDeep(options || {}, options_1.defaultOIDCProviderOptions), { issuer, trustProxy, adapter } = _a, providerConfig = tslib_1.__rest(_a, ["issuer", "trustProxy", "adapter"]);
        /* create provider adapter */
        const adapterKey = Object.keys(adapter_1.OIDCAdapterConstructors).find(k => k.toLowerCase() === options.adapter.type.toLowerCase())
            || Object.keys(adapter_1.OIDCAdapterConstructors)[0];
        this.adapter = new adapter_1.OIDCAdapterConstructors[adapterKey]({
            logger,
        }, options.adapter.options);
        /* create original provider */
        const config = _.defaultsDeep(Object.assign({ 
            // persistent storage for OP
            adapter: this.adapter.originalAdapterProxy, 
            // bridge between IDP and OP
            findAccount(ctx, id, token) {
                return tslib_1.__awaiter(this, void 0, void 0, function* () {
                    // token is a reference to the token used for which a given account is being loaded,
                    // it is undefined in scenarios where account claims are returned from authorization endpoint
                    // ctx is the koa request context
                    return props.identity.find(id);
                });
            } }, interaction_1.interactionConfiguration), providerConfig);
        const original = this.original = new types_1.Provider(issuer, config);
        original.env = "production";
        original.proxy = trustProxy !== false;
        // attach logger
        original.app.use((ctx, next) => {
            ctx.logger = logger;
            return next();
        });
        // mount routes
        original.app.use(interaction_1.createInteractionRouter(original).routes());
        // apply debugging features
        if (issuer.startsWith("http://")) {
            debug_1.applyDebugOptions(original, logger, {
                "disable-implicit-forbid-localhost": true,
                "disable-implicit-force-https": true,
            });
        }
    }
    get idp() {
        return this.props.identity;
    }
    get config() {
        return weak_cache_1.default(this.original).configuration();
    }
    get defaultRoutes() {
        return Object.assign({ discovery: "/.well-known/openid-configuration" }, this.config.routes);
    }
    get router() {
        return koa_mount_1.default(this.original.app);
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
            // start adapter
            yield this.adapter.start();
            this.working = true;
            this.logger.info(`oidc provider has been started:`, this.defaultRoutes);
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
    /* bind lazy methods */
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
                        throw new types_1.errors.InvalidClient("client not found");
                    }
                    return client;
                });
            },
            create(metadata) {
                return tslib_1.__awaiter(this, void 0, void 0, function* () {
                    if (metadata.client_id && (yield methods.find(metadata.client_id))) {
                        throw new types_1.errors.InvalidClient("client_id is duplicated");
                    }
                    provider.logger.info(`create client ${kleur.cyan(metadata.client_id)}:`, metadata);
                    const client = yield originalMethods.clientAdd(metadata, { store: true });
                    return client.metadata();
                });
            },
            update(metadata) {
                return tslib_1.__awaiter(this, void 0, void 0, function* () {
                    yield methods.find(metadata.client_id);
                    provider.logger.info(`update client ${kleur.cyan(metadata.client_id || "<unknown>")}:`, metadata);
                    const client = yield originalMethods.clientAdd(metadata, { store: true });
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
}
exports.OIDCProvider = OIDCProvider;
//# sourceMappingURL=provider.js.map
"use strict";
/*
 * moleculer-iam
 * Copyright (c) 2019 QMIT Inc. (https://github.com/qmit-pro/moleculer-iam)
 * MIT Licensed
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const moleculer_1 = require("moleculer");
const identity_1 = require("../identity");
const oidc_1 = require("../oidc");
const server_1 = require("../server");
const params_1 = require("./params");
function IAMServiceSchema(opts) {
    let idp;
    let oidc;
    let server;
    return {
        created() {
            // create identity provider
            idp = this.idp = new identity_1.IdentityProvider({
                logger: this.broker.getLogger("idp"),
            }, opts.idp);
            // create oidc provider
            oidc = this.oidc = new oidc_1.OIDCProvider({
                idp,
                logger: this.broker.getLogger("oidc"),
            }, opts.oidc);
            // create server
            server = this.server = new server_1.IAMServer({
                oidc,
                logger: this.broker.getLogger("server"),
            }, opts.server);
        },
        started() {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                yield server.start();
                yield this.clearCache("client.**");
            });
        },
        stopped() {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                yield server.stop();
            });
        },
        name: "iam",
        settings: {},
        actions: {
            /* Client Management */
            "client.create": {
                description: `
          Create OIDC Client. All params from below reference will be accepted.
          ref: https://openid.net/specs/openid-connect-registration-1_0.html#ClientMetadata
        `,
                params: params_1.IAMServiceActionParams["client.create"],
                handler(ctx) {
                    return tslib_1.__awaiter(this, void 0, void 0, function* () {
                        try {
                            const client = yield oidc.createClient(ctx.params);
                            yield this.clearCache("client.**");
                            return client;
                        }
                        catch (error) {
                            throw this.transformOIDCError(error);
                        }
                    });
                },
            },
            "client.update": {
                params: params_1.IAMServiceActionParams["client.update"],
                handler(ctx) {
                    return tslib_1.__awaiter(this, void 0, void 0, function* () {
                        try {
                            const client = yield oidc.updateClient(ctx.params);
                            yield this.clearCache("client.**");
                            return client;
                        }
                        catch (error) {
                            throw this.transformOIDCError(error);
                        }
                    });
                },
            },
            "client.delete": {
                params: {
                    client_id: "string",
                },
                handler(ctx) {
                    return tslib_1.__awaiter(this, void 0, void 0, function* () {
                        try {
                            yield oidc.deleteClient(ctx.params.client_id);
                            yield this.clearCache("client.**");
                            yield this.broker.broadcast("iam.client.deleted", ctx.params); // 'oidc-provider' has a hard coded LRU cache internally... using pub/sub to clear distributed nodes' cache
                            return true;
                        }
                        catch (error) {
                            throw this.transformOIDCError(error);
                        }
                    });
                },
            },
            "client.find": {
                cache: {
                    ttl: 3600,
                },
                params: {
                    client_id: "string",
                },
                handler(ctx) {
                    return tslib_1.__awaiter(this, void 0, void 0, function* () {
                        return oidc.findClient(ctx.params.client_id);
                    });
                },
            },
            "client.get": {
                cache: {
                    ttl: 3600,
                },
                params: {
                    where: {
                        type: "any",
                        optional: true,
                    },
                    offset: {
                        type: "number",
                        positive: true,
                        default: 0,
                    },
                    limit: {
                        type: "number",
                        positive: true,
                        default: 10,
                    },
                },
                handler(ctx) {
                    return tslib_1.__awaiter(this, void 0, void 0, function* () {
                        try {
                            const { offset, limit, where } = ctx.params;
                            const [total, entries] = yield Promise.all([
                                oidc.countClients(where),
                                oidc.getClients(ctx.params),
                            ]);
                            return { offset, limit, total, entries };
                        }
                        catch (error) {
                            throw this.transformOIDCError(error);
                        }
                    });
                },
            },
            "client.count": {
                cache: {
                    ttl: 3600,
                },
                params: {
                    where: {
                        type: "any",
                        optional: true,
                    },
                },
                handler(ctx) {
                    return tslib_1.__awaiter(this, void 0, void 0, function* () {
                        try {
                            return yield oidc.countClients(ctx.params && ctx.params.where);
                        }
                        catch (error) {
                            throw this.transformOIDCError(error);
                        }
                    });
                },
            },
            /* "Session", "AccessToken", "AuthorizationCode", "RefreshToken", "DeviceCode", "InitialAccessToken", "RegistrationAccessToken", "Interaction", "ReplayDetection", "PushedAuthorizationRequest" Management */
            "model.get": {
                cache: {
                    ttl: 30,
                },
                params: {
                    kind: {
                        type: "enum",
                        values: oidc_1.OIDCProvider.volatileModelNames,
                    },
                    where: {
                        type: "any",
                        optional: true,
                    },
                    offset: {
                        type: "number",
                        positive: true,
                        default: 0,
                    },
                    limit: {
                        type: "number",
                        positive: true,
                        default: 10,
                    },
                },
                handler(ctx) {
                    return tslib_1.__awaiter(this, void 0, void 0, function* () {
                        const _a = ctx.params, { offset, limit, kind, where } = _a, args = tslib_1.__rest(_a, ["offset", "limit", "kind", "where"]);
                        const [total, entries] = yield Promise.all([
                            oidc.countModels(kind, where),
                            oidc.getModels(kind, Object.assign({ offset, limit, where }, args)),
                        ]);
                        return { offset, limit, total, entries };
                    });
                },
            },
            "model.count": {
                cache: {
                    ttl: 30,
                },
                params: {
                    kind: {
                        type: "enum",
                        values: oidc_1.OIDCProvider.volatileModelNames,
                    },
                    where: {
                        type: "any",
                        optional: true,
                    },
                },
                handler(ctx) {
                    return tslib_1.__awaiter(this, void 0, void 0, function* () {
                        const { kind, where } = ctx.params;
                        return oidc.countModels(kind, where);
                    });
                },
            },
            "model.delete": {
                params: {
                    kind: {
                        type: "enum",
                        values: oidc_1.OIDCProvider.volatileModelNames,
                    },
                    where: {
                        type: "any",
                        optional: false,
                    },
                    offset: {
                        type: "number",
                        positive: true,
                        default: 0,
                    },
                    limit: {
                        type: "number",
                        positive: true,
                        default: 10,
                    },
                },
                handler(ctx) {
                    return tslib_1.__awaiter(this, void 0, void 0, function* () {
                        const _a = ctx.params, { kind } = _a, args = tslib_1.__rest(_a, ["kind"]);
                        return oidc.deleteModels(kind, args);
                    });
                },
            },
            /* Identity Claims Schema Management */
            "schema.get": {
                params: {
                    scope: {
                        type: "array",
                        items: {
                            type: "string",
                            trim: true,
                            empty: false,
                        },
                        default: [],
                    },
                    key: {
                        type: "string",
                        empty: false,
                        trim: true,
                        optional: true,
                    },
                    version: {
                        type: "string",
                        empty: false,
                        trim: true,
                        optional: true,
                    },
                    active: {
                        type: "boolean",
                        optional: true,
                    },
                },
                handler(ctx) {
                    return tslib_1.__awaiter(this, void 0, void 0, function* () {
                        return idp.claims.getClaimsSchemata(ctx.params);
                    });
                },
            },
            "schema.find": {
                params: {
                    key: {
                        type: "string",
                        empty: false,
                        trim: true,
                    },
                    version: {
                        type: "string",
                        empty: false,
                        trim: true,
                        optional: true,
                    },
                    active: {
                        type: "boolean",
                        optional: true,
                    },
                },
                handler(ctx) {
                    return tslib_1.__awaiter(this, void 0, void 0, function* () {
                        return idp.claims.getClaimsSchema(ctx.params);
                    });
                },
            },
            "schema.define": {
                params: params_1.IAMServiceActionParams["schema.define"],
                handler(ctx) {
                    return tslib_1.__awaiter(this, void 0, void 0, function* () {
                        return idp.claims.defineClaimsSchema(ctx.params);
                    });
                },
            },
        },
        events: {
            "iam.client.deleted"(ctx) {
                return tslib_1.__awaiter(this, void 0, void 0, function* () {
                    try {
                        // to clear internal memory cache
                        yield oidc.deleteClient(ctx.params.client_id);
                    }
                    catch (err) {
                        // ...NOTHING
                    }
                });
            },
        },
        methods: {
            transformOIDCError(err) {
                if (err.status <= 400 && err.status < 500) {
                    return new moleculer_1.Errors.MoleculerClientError(err.error_description, err.statusCode, err.error);
                }
                else if (err.status >= 500) {
                    return new moleculer_1.Errors.MoleculerServerError(err.error_description, err.statusCode, err.error);
                }
                return err;
            },
            clearCache(...keys) {
                return tslib_1.__awaiter(this, void 0, void 0, function* () {
                    if (this.broker.cacher) {
                        if (keys.length === 0) {
                            keys = ["**"];
                        }
                        const fullKeys = keys.map(key => `${this.fullName}.${key}`);
                        yield this.broker.cacher.clean(fullKeys);
                    }
                });
            },
        },
    };
}
exports.IAMServiceSchema = IAMServiceSchema;
//# sourceMappingURL=service.js.map
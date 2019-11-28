"use strict";
/*
 * moleculer-iam
 * Copyright (c) 2019 QMIT Inc. (https://github.com/qmit-pro/moleculer-iam)
 * MIT Licensed
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const moleculer_1 = require("moleculer");
const uuid_1 = tslib_1.__importDefault(require("uuid"));
const iam_params_1 = require("./iam.params");
function IAMServiceSchema(oidc, identity) {
    return {
        name: "iam",
        settings: {},
        actions: {
            /* Client Management */
            "client.create": {
                description: `
          Create OIDC Client. All params from below reference will be accepted.
          ref: https://openid.net/specs/openid-connect-registration-1_0.html#ClientMetadata
        `,
                params: iam_params_1.IAMServiceActionParams["client.create"],
                handler(ctx) {
                    return tslib_1.__awaiter(this, void 0, void 0, function* () {
                        try {
                            if (ctx.params) {
                                ctx.params.client_secret = this.generateClientSecret();
                            }
                            const client = yield oidc.client.create(ctx.params);
                            yield this.clearCache("client.**");
                            return client;
                        }
                        catch (error) {
                            throw this.transformError(error);
                        }
                    });
                },
            },
            "client.update": {
                params: iam_params_1.IAMServiceActionParams["client.update"],
                handler(ctx) {
                    return tslib_1.__awaiter(this, void 0, void 0, function* () {
                        try {
                            const old = yield oidc.client.findOrFail(ctx.params.client_id);
                            const payload = ctx.params;
                            // update client_secret
                            if (payload.reset_client_secret === true) {
                                payload.client_secret = this.generateClientSecret();
                                delete payload.reset_client_secret;
                            }
                            const client = yield oidc.client.update(Object.assign(Object.assign({}, old), payload));
                            yield this.clearCache("client.**");
                            return client;
                        }
                        catch (error) {
                            throw this.transformError(error);
                        }
                    });
                },
            },
            "client.remove": {
                params: {
                    client_id: "string",
                },
                handler(ctx) {
                    return tslib_1.__awaiter(this, void 0, void 0, function* () {
                        try {
                            yield oidc.client.remove(ctx.params.client_id);
                            yield this.clearCache("client.**");
                            return true;
                        }
                        catch (error) {
                            throw this.transformError(error);
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
                        try {
                            return yield oidc.client.findOrFail(ctx.params.client_id);
                        }
                        catch (error) {
                            throw this.transformError(error);
                        }
                    });
                },
            },
            "client.get": {
                cache: {
                    ttl: 3600,
                },
                params: {
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
                            const { offset, limit } = ctx.params;
                            const [total, entries] = yield Promise.all([
                                oidc.client.count(),
                                oidc.client.get({ offset, limit }),
                            ]);
                            return { offset, limit, total, entries };
                        }
                        catch (error) {
                            throw this.transformError(error);
                        }
                    });
                },
            },
            "client.count": {
                handler(ctx) {
                    return tslib_1.__awaiter(this, void 0, void 0, function* () {
                        try {
                            return yield oidc.client.count();
                        }
                        catch (error) {
                            throw this.transformError(error);
                        }
                    });
                },
            },
        },
        methods: {
            transformError(err) {
                if (err.status <= 400 && err.status < 500) {
                    return new moleculer_1.Errors.MoleculerClientError(err.error_description, err.statusCode, err.error);
                }
                else if (err.status >= 500) {
                    return new moleculer_1.Errors.MoleculerServerError(err.error_description, err.statusCode, err.error);
                }
                return err;
            },
            generateClientSecret() {
                return uuid_1.default().replace(/\-/g, "") + uuid_1.default().replace(/\-/g, "");
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
        started() {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                yield oidc.start();
            });
        },
        stopped() {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                yield oidc.stop();
            });
        },
    };
}
exports.IAMServiceSchema = IAMServiceSchema;
//# sourceMappingURL=iam.js.map
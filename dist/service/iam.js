"use strict";
/*
 * moleculer-iam
 * Copyright (c) 2019 QMIT Inc. (https://github.com/qmit-pro/moleculer-iam)
 * MIT Licensed
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const moleculer_1 = require("moleculer");
const provider_1 = require("../provider");
const iam_params_1 = require("./iam.params");
const uuid_1 = tslib_1.__importDefault(require("uuid"));
function createIAMServiceSchema(providerProps, providerOptions) {
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
                                ctx.params.client_secret = uuid_1.default().replace(/\-/g, "");
                            }
                            const client = yield this.provider.createClient(ctx.params);
                            return client;
                        }
                        catch (error) {
                            throw this.transformError(error);
                        }
                    });
                },
            },
            "client.update": {
                params: {},
                handler(ctx) {
                    return "Hello " + (ctx.params.name || "Anonymous");
                },
            },
            "client.remove": {
                params: {},
                handler(ctx) {
                    return "Hello " + (ctx.params.name || "Anonymous");
                },
            },
        },
        methods: {
            transformError: (err) => {
                if (err.status <= 400 && err.status < 500) {
                    return new moleculer_1.Errors.MoleculerClientError(err.error_description, err.statusCode, err.error);
                }
                else if (err.status >= 500) {
                    return new moleculer_1.Errors.MoleculerServerError(err.error_description, err.statusCode, err.error);
                }
                return err;
            },
        },
        created() {
            this.provider = new provider_1.OIDCProvider(Object.assign(Object.assign({}, providerProps), { logger: this.broker.getLogger("OIDC") }), providerOptions);
        },
        started() {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                this.provider.start();
            });
        },
        stopped() {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                this.provider.stop();
            });
        },
    };
}
exports.createIAMServiceSchema = createIAMServiceSchema;
//# sourceMappingURL=iam.js.map
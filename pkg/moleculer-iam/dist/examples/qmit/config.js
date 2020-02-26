"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const vault_sync_1 = tslib_1.__importDefault(require("vault-sync"));
// create global configuration
// can fetch vault secrets in local/kubernetes environment
/* istanbul ignore next */
exports.config = vault_sync_1.default(async (get, list) => {
    const env = process.env.APP_ENV || "dev";
    const isDev = env === "dev";
    return {
        env,
        isDev,
        isDebug: !!process.env.APP_DEBUG,
        iam: (await get(`${isDev ? "dev" : "prod"}/data/iam`)).data,
    };
}, {
    uri: "https://vault.internal.qmit.pro",
    method: `k8s/${process.env.APP_K8S_CLUSTER || "dev"}`,
    role: "default",
});
//# sourceMappingURL=config.js.map
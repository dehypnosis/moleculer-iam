"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const kleur = tslib_1.__importStar(require("kleur"));
// it makes side-effects for provider
// ref: https://github.com/panva/node-oidc-provider/tree/master/recipes#oidc-provider-recipes
function extendOIDCProvider(provider, logger, extension) {
    // extend client schema validation
    if (extension["disable-implicit-force-https"] || extension["disable-implicit-forbid-localhost"]) {
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
}
exports.extendOIDCProvider = extendOIDCProvider;
//# sourceMappingURL=extensions.js.map
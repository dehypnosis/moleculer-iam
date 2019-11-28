"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
class Identity {
    constructor(id) {
        this.id = id;
    }
    get accountId() {
        return this.id;
    }
    /**
     * @param use - can either be "id_token" or "userinfo", depending on where the specific claims are intended to be put in.
     * @param scope - the intended scope, while oidc-provider will mask
     *   claims depending on the scope automatically you might want to skip
     *   loading some claims from external resources etc. based on this detail
     *   or not return them in id tokens but only userinfo and so on.
     * @param claims
     * @param rejected
     */
    claims(use, scope, claims, rejected) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return { sub: this.id };
        });
    }
}
exports.Identity = Identity;
//# sourceMappingURL=identity.js.map
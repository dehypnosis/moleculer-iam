"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const validator_1 = require("../validator");
const error_1 = require("./error");
class Identity {
    constructor(props) {
        this.props = props;
        /* credentials */
        this.testCredentials = validator_1.validator.compile({
            password: {
                type: "string",
                min: 4,
                max: 16,
                optional: true,
            },
        });
    }
    get id() {
        return this.props.id;
    }
    get accountId() {
        return this.props.id;
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
    claims(use = "userinfo", scope = "", claims, rejected) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.props.adapter.claims(this, {
                use,
                scope: typeof scope === "string" ? scope.split(" ").filter(s => !!s) : scope,
                claims,
                rejected,
            });
        });
    }
    updateClaims(claims, scope = "") {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.props.adapter.updateClaims(this, claims, {
                scope: typeof scope === "string" ? scope.split(" ").filter(s => !!s) : scope,
            });
        });
    }
    /* identity metadata (federation information, etc. not-versioned) */
    metadata() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.props.adapter.metadata(this);
        });
    }
    updateMetadata(metadata) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.props.adapter.updateMetadata(this, metadata);
        });
    }
    validateCredentials(credentials) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const result = this.testCredentials(credentials);
            if (result !== true) {
                throw new error_1.Errors.ValidationError(result);
            }
        });
    }
    assertCredentials(credentials) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.props.adapter.assertCredentials(this, credentials);
        });
    }
    updateCredentials(credentials) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.validateCredentials(credentials);
            return this.props.adapter.updateCredentials(this, credentials);
        });
    }
    /* delete identity */
    delete(permanently = false) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (permanently) {
                yield this.props.adapter.delete(this);
            }
            else {
                yield this.props.adapter.updateMetadata(this, { softDeleted: true });
            }
        });
    }
    isSoftDeleted() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.metadata().then(meta => meta.softDeleted);
        });
    }
    restoreSoftDeleted() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.props.adapter.updateMetadata(this, { softDeleted: false });
        });
    }
}
exports.Identity = Identity;
//# sourceMappingURL=identity.js.map
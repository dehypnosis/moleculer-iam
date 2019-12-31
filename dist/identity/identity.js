"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const _ = tslib_1.__importStar(require("lodash"));
const metadata_1 = require("./metadata");
const error_1 = require("./error");
class Identity {
    constructor(props) {
        this.props = props;
    }
    get id() {
        return this.props.id;
    }
    get adapter() {
        return this.props.provider.adapter;
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
            return this.adapter.getClaims(this.id, {
                use,
                scope: typeof scope === "string" ? scope.split(" ").filter(s => !!s) : scope,
                claims,
                rejected,
            });
        });
    }
    updateClaims(claims, scope = "", transaction) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const scopeWithoutOpenID = (typeof scope === "string" ? scope.split(" ").filter(s => !!s) : scope).filter(s => s !== "openid");
            yield this.adapter.createOrUpdateClaims(this.id, claims, {
                scope: scopeWithoutOpenID,
            }, transaction);
        });
    }
    get mandatoryScopes() {
        return this.props.provider.claims.mandatoryScopes;
    }
    deleteClaims(scope = "", transaction) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            // check mandatory scopes
            const scopes = (typeof scope === "string" ? scope.split(" ").filter(s => !!s) : scope);
            if (scopes.some(s => this.mandatoryScopes.includes(s))) {
                throw new error_1.Errors.BadRequestError(`cannot delete mandatory scopes: ${this.mandatoryScopes}`);
            }
            yield this.adapter.deleteClaims(this.id, scopes, transaction);
        });
    }
    /* identity metadata (federation information, etc. not-versioned) */
    metadata() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const metadata = yield this.adapter.getMetadata(this.id);
            if (!metadata)
                throw new error_1.Errors.UnexpectedError(`empty metadata: ${this.id}`);
            return metadata;
        });
    }
    updateMetadata(metadata, transaction) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.adapter.createOrUpdateMetadata(this.id, _.defaultsDeep(metadata, metadata_1.defaultIdentityMetadata), transaction);
        });
    }
    /* credentials */
    validateCredentials(credentials) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.adapter.validateCredentials(credentials);
        });
    }
    assertCredentials(credentials) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.adapter.assertCredentials(this.id, credentials);
        });
    }
    updateCredentials(credentials, transaction) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.adapter.validateCredentials(credentials);
            return this.adapter.createOrUpdateCredentials(this.id, credentials, transaction);
        });
    }
    /* delete identity */
    delete(permanently = false, transaction) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (permanently) {
                yield this.adapter.delete(this.id, transaction);
            }
            else {
                yield this.adapter.createOrUpdateMetadata(this.id, { softDeleted: true }, transaction);
            }
        });
    }
    isSoftDeleted() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.metadata().then(meta => meta.softDeleted);
        });
    }
    restoreSoftDeleted(transaction) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.adapter.createOrUpdateMetadata(this.id, { softDeleted: false }, transaction);
        });
    }
}
exports.Identity = Identity;
//# sourceMappingURL=identity.js.map
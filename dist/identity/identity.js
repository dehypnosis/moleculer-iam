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
            return this.adapter.getClaims(this.id, typeof scope === "string" ? scope.split(" ").filter(s => !!s) : scope);
        });
    }
    updateClaims(claims, scope = "", transaction) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.adapter.createOrUpdateClaimsWithValidation(this.id, claims, typeof scope === "string" ? scope.split(" ").filter(s => !!s) : scope, false, transaction);
        });
    }
    deleteClaims(scope = "", transaction) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            // check mandatory scopes
            const scopes = (typeof scope === "string" ? scope.split(" ").filter(s => !!s) : scope);
            const mandatoryScopes = this.props.provider.claims.mandatoryScopes;
            if (scopes.some(s => mandatoryScopes.includes(s))) {
                throw new error_1.Errors.BadRequestError(`cannot delete mandatory scopes: ${mandatoryScopes}`);
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
    assertCredentials(credentials) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.adapter.assertCredentials(this.id, credentials);
        });
    }
    updateCredentials(credentials, transaction) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.adapter.createOrUpdateCredentialsWithValidation(this.id, credentials, transaction);
        });
    }
    /* update all */
    update(scope = "", claims, metadata, credentials, transaction) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            // validate claims and credentials
            if (typeof scope === "string") {
                scope = scope.split(" ").filter(s => !!s);
            }
            else {
                scope = [];
            }
            // save metadata, claims, credentials
            let isolated = false;
            if (!transaction) {
                transaction = transaction = yield this.adapter.transaction();
                isolated = true;
            }
            try {
                if (typeof claims === "object" && claims !== null && Object.keys(claims).length > 0) {
                    yield this.updateClaims(claims, scope, transaction);
                }
                if (typeof credentials === "object" && credentials !== null && Object.keys(credentials).length > 0) {
                    yield this.updateCredentials(credentials, transaction);
                }
                if (typeof metadata === "object" && metadata !== null && Object.keys(metadata).length > 0) {
                    yield this.updateMetadata(metadata, transaction);
                }
                if (isolated) {
                    yield transaction.commit();
                }
            }
            catch (err) {
                if (isolated) {
                    yield transaction.rollback();
                }
                throw err;
            }
            return;
        });
    }
    /* fetch all */
    json(scope = "") {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const [claims, metadata] = yield Promise.all([this.claims(undefined, scope), this.metadata()]);
            return {
                id: this.id,
                claims,
                metadata,
            };
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
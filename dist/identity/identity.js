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
            return this.props.adapter.getClaims(this, {
                use,
                scope: typeof scope === "string" ? scope.split(" ").filter(s => !!s) : scope,
                claims,
                rejected,
            });
        });
    }
    updateClaims(claims, scope = "", transaction) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let isolated = false;
            if (!transaction) {
                isolated = true;
                transaction = yield this.props.adapter.transaction();
            }
            try {
                const scopeWithoutOpenID = (typeof scope === "string" ? scope.split(" ").filter(s => !!s) : scope).filter(s => s !== "openid");
                yield this.props.adapter.createOrUpdateClaims(this, claims, {
                    scope: scopeWithoutOpenID,
                }, transaction);
                yield this.props.adapter.onClaimsUpdated(this, transaction);
                if (isolated)
                    yield transaction.commit();
            }
            catch (err) {
                if (isolated)
                    yield transaction.rollback();
                throw err;
            }
        });
    }
    /* identity metadata (federation information, etc. not-versioned) */
    metadata() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const metadata = yield this.props.adapter.getMetadata(this);
            if (!metadata)
                throw new error_1.Errors.IdentityNotExistsError();
            return metadata;
        });
    }
    updateMetadata(metadata, transaction) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.props.adapter.createOrUpdateMetadata(this, _.defaultsDeep(metadata, metadata_1.defaultIdentityMetadata), transaction);
        });
    }
    /* credentials */
    validateCredentials(credentials) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.props.adapter.validateCredentials(credentials);
        });
    }
    assertCredentials(credentials) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.props.adapter.assertCredentials(this, credentials);
        });
    }
    updateCredentials(credentials, transaction) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.props.adapter.validateCredentials(credentials);
            return this.props.adapter.createOrUpdateCredentials(this, credentials, transaction);
        });
    }
    /* delete identity */
    delete(permanently = false, transaction) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (permanently) {
                yield this.props.adapter.delete(this, transaction);
            }
            else {
                yield this.props.adapter.createOrUpdateMetadata(this, { softDeleted: true }, transaction);
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
            yield this.props.adapter.createOrUpdateMetadata(this, { softDeleted: false }, transaction);
        });
    }
}
exports.Identity = Identity;
//# sourceMappingURL=identity.js.map
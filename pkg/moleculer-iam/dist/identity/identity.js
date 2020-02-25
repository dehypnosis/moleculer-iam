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
    async claims(use = "userinfo", scope = "", claims, rejected) {
        return this.adapter.getClaims(this.id, typeof scope === "string" ? scope.split(" ").filter(s => !!s) : scope);
    }
    async updateClaims(claims, scope = "", transaction) {
        await this.adapter.createOrUpdateClaimsWithValidation(this.id, claims, typeof scope === "string" ? scope.split(" ").filter(s => !!s) : scope, false, transaction);
    }
    async deleteClaims(scope = "", transaction) {
        // check mandatory scopes
        const scopes = (typeof scope === "string" ? scope.split(" ").filter(s => !!s) : scope);
        const mandatoryScopes = this.props.provider.claims.mandatoryScopes;
        if (scopes.some(s => mandatoryScopes.includes(s))) {
            throw new error_1.Errors.BadRequestError(`cannot delete mandatory scopes: ${mandatoryScopes}`);
        }
        await this.adapter.deleteClaims(this.id, scopes, transaction);
    }
    /* identity metadata (federation information, etc. not-versioned) */
    async metadata() {
        const metadata = await this.adapter.getMetadata(this.id);
        if (!metadata)
            throw new error_1.Errors.UnexpectedError(`empty metadata: ${this.id}`);
        return metadata;
    }
    async updateMetadata(metadata, transaction) {
        await this.adapter.createOrUpdateMetadata(this.id, _.defaultsDeep(metadata, metadata_1.defaultIdentityMetadata), transaction);
    }
    /* credentials */
    async assertCredentials(credentials) {
        return this.adapter.assertCredentials(this.id, credentials);
    }
    async updateCredentials(credentials, transaction) {
        return this.adapter.createOrUpdateCredentialsWithValidation(this.id, credentials, transaction);
    }
    /* update all */
    async update(scope = "", claims, metadata, credentials, transaction) {
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
            transaction = transaction = await this.adapter.transaction();
            isolated = true;
        }
        try {
            if (typeof claims === "object" && claims !== null && Object.keys(claims).length > 0) {
                await this.updateClaims(claims, scope, transaction);
            }
            if (typeof credentials === "object" && credentials !== null && Object.keys(credentials).length > 0) {
                await this.updateCredentials(credentials, transaction);
            }
            if (typeof metadata === "object" && metadata !== null && Object.keys(metadata).length > 0) {
                await this.updateMetadata(metadata, transaction);
            }
            if (isolated) {
                await transaction.commit();
            }
        }
        catch (err) {
            if (isolated) {
                await transaction.rollback();
            }
            throw err;
        }
        return;
    }
    /* fetch all */
    async json(scope = "") {
        const [claims, metadata] = await Promise.all([this.claims(undefined, scope), this.metadata()]);
        return {
            id: this.id,
            claims,
            metadata,
        };
    }
    /* delete identity */
    async delete(permanently = false, transaction) {
        if (permanently) {
            await this.adapter.delete(this.id, transaction);
        }
        else {
            await this.adapter.createOrUpdateMetadata(this.id, { softDeleted: true }, transaction);
        }
    }
    async isSoftDeleted() {
        return this.metadata().then(meta => meta.softDeleted);
    }
    async restoreSoftDeleted(transaction) {
        await this.adapter.createOrUpdateMetadata(this.id, { softDeleted: false }, transaction);
    }
}
exports.Identity = Identity;
//# sourceMappingURL=identity.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const _ = tslib_1.__importStar(require("lodash"));
const adapter_1 = require("../adapter");
const identity_1 = require("../../identity");
// tslint:disable-next-line:class-name
class IDP_MemoryAdapter extends adapter_1.IDPAdapter {
    constructor(props, options) {
        super(props);
        this.props = props;
        this.displayName = "Memory";
        /* metadata */
        this.identityMetadataMap = new Map();
        /* claims */
        this.identityClaimsMap = new Map();
        /* credentials */
        this.identityCredentialsMap = new Map();
        /* claims schema */
        this.schemata = new Array();
        this.migrationLocksMap = new Map();
    }
    /* fetch */
    // support only identity by id (sub), email, phone
    find(args) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let foundId = "";
            const argsId = args.id || args.claims && args.claims.sub;
            if (argsId) {
                const schema = yield this.getClaimsSchema({ key: "sub", active: true });
                for (const [id, claims] of this.identityClaimsMap.entries()) {
                    if (claims.some(c => c.key === "sub" && c.value === argsId && c.schemaVersion === schema.version)) {
                        foundId = id;
                        break;
                    }
                }
            }
            else if (args.claims && args.claims.email) {
                const schema = yield this.getClaimsSchema({ key: "email", active: true });
                for (const [id, claims] of this.identityClaimsMap.entries()) {
                    if (claims.some(c => c.key === "email" && c.value === args.claims.email && c.schemaVersion === schema.version)) {
                        foundId = id;
                        break;
                    }
                }
            }
            else if (args.claims && args.claims.phone_number) {
                const schema = yield this.getClaimsSchema({ key: "phone_number", active: true });
                for (const [id, claims] of this.identityClaimsMap.entries()) {
                    if (claims.some(c => c.key === "phone_number" && c.value === args.claims.phone_number && c.schemaVersion === schema.version)) {
                        foundId = id;
                        break;
                    }
                }
            }
            if (foundId) {
                const identity = new identity_1.Identity({
                    id: foundId,
                    adapter: this,
                });
                // filter by metadata just straight forward for test
                if (args.metadata) {
                    const identityMetadata = yield identity.metadata();
                    if (!_.isMatch(identityMetadata, args.metadata)) {
                        return;
                    }
                }
                return identity;
            }
        });
    }
    // only support offset, limit
    get(args) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let identities = [...this.identityMetadataMap.keys()]
                .map(id => new identity_1.Identity({ id, adapter: this }));
            // filter by metadata just straight forward for test
            if (args.where && args.where.metadata) {
                const filteredIdentities = [];
                // filter by metadata just straight forward for test
                for (const identity of identities) {
                    const identityMetadata = yield identity.metadata();
                    if (_.isMatch(identityMetadata, args.where.metadata)) {
                        filteredIdentities.push(identity);
                    }
                }
                identities = filteredIdentities;
            }
            return identities
                .slice(args.offset || 0, typeof args.limit === "undefined" ? identities.length : args.limit);
        });
    }
    count(args) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return (yield this.get(args)).length;
        });
    }
    /* delete */
    delete(identity) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!this.identityMetadataMap.has(identity.id))
                return false;
            this.identityMetadataMap.delete(identity.id);
            this.identityClaimsMap.delete(identity.id);
            this.identityCredentialsMap.delete(identity.id);
            return true;
        });
    }
    createOrUpdateMetadata(identity, metadata, transaction) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const old = this.identityMetadataMap.get(identity.id);
            this.identityMetadataMap.set(identity.id, _.defaultsDeep(metadata, old || {}));
        });
    }
    getMetadata(identity) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.identityMetadataMap.get(identity.id);
        });
    }
    createOrUpdateVersionedClaims(identity, claims) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let oldClaims = this.identityClaimsMap.get(identity.id);
            if (!oldClaims) {
                oldClaims = [];
                this.identityClaimsMap.set(identity.id, oldClaims);
            }
            for (const claim of claims) {
                const oldClaim = oldClaims.find(c => c.key === claim.key && c.schemaVersion === claim.schemaVersion);
                if (oldClaim) {
                    oldClaim.value = claim.value;
                }
                else {
                    oldClaims.push(claim);
                }
            }
        });
    }
    onClaimsUpdated(identity, updatedClaims, transaction) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            // ...
        });
    }
    getVersionedClaims(identity, claims) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const foundClaims = {};
            const storedClaims = this.identityClaimsMap.get(identity.id) || [];
            for (const { key, schemaVersion } of claims) {
                const foundClaim = storedClaims.find(claim => {
                    if (key !== claim.key)
                        return false;
                    if (typeof schemaVersion !== "undefined" && schemaVersion !== claim.schemaVersion)
                        return false;
                    return true;
                });
                if (foundClaim)
                    foundClaims[key] = foundClaim.value;
            }
            return foundClaims;
        });
    }
    createOrUpdateCredentials(identity, credentials, transaction) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const cred = this.identityCredentialsMap.get(identity.id);
            if (cred && JSON.stringify(cred) === JSON.stringify(credentials))
                return false;
            this.identityCredentialsMap.set(identity.id, Object.assign(Object.assign({}, cred), credentials));
            return true;
        });
    }
    assertCredentials(identity, credentials) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const cred = this.identityCredentialsMap.get(identity.id);
            if (!cred)
                return false;
            for (const [type, value] of Object.entries(credentials)) {
                if (cred[type] !== value)
                    return false;
            }
            return true;
        });
    }
    createClaimsSchema(schema, transaction) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.schemata.push(schema);
        });
    }
    forceDeleteClaimsSchema(key) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.schemata = this.schemata.filter(schema => schema.key !== key);
        });
    }
    getClaimsSchema(args) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { key, version, active } = args;
            return this.schemata.find(sch => {
                if (key !== sch.key)
                    return false;
                if (typeof version !== "undefined" && version !== sch.version)
                    return false;
                if (typeof active !== "undefined" && active !== sch.active)
                    return false;
                return true;
            });
        });
    }
    setActiveClaimsSchema(args, transaction) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { key, version } = args;
            this.schemata.forEach(sch => {
                if (key !== sch.key)
                    return;
                sch.active = version === sch.version;
            });
        });
    }
    getClaimsSchemata(args) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { scope, key, version, active } = args;
            return this.schemata.filter(schema => {
                if (scope.length !== 0 && !scope.includes(schema.scope))
                    return false;
                if (typeof key !== "undefined" && key !== schema.key)
                    return false;
                if (typeof version !== "undefined" && version !== schema.version)
                    return false;
                if (typeof active !== "undefined" && active !== schema.active)
                    return false;
                return true;
            });
        });
    }
    /* transaction and migration lock for distributed system */
    transaction() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const logger = this.logger;
            return {
                commit() {
                    return tslib_1.__awaiter(this, void 0, void 0, function* () {
                        logger.warn("Memory adapter has not implemented transaction: commit()");
                    });
                },
                rollback() {
                    return tslib_1.__awaiter(this, void 0, void 0, function* () {
                        logger.warn("Memory adapter has not implemented transaction: commit()");
                    });
                },
            };
        });
    }
    acquireMigrationLock(key) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this.migrationLocksMap.size > 0) {
                yield new Promise(resolve => setTimeout(resolve, 1000));
                return this.acquireMigrationLock(key);
            }
            this.migrationLocksMap.set(key, true);
        });
    }
    touchMigrationLock(key, migratedIdentitiesNumber) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            // ...
            this.logger.warn("Memory adapter has not implemented dead lock resolving strategy, migration is working for: ", key, migratedIdentitiesNumber);
        });
    }
    releaseMigrationLock(key) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.migrationLocksMap.delete(key);
        });
    }
}
exports.IDP_MemoryAdapter = IDP_MemoryAdapter;
//# sourceMappingURL=adapter.js.map
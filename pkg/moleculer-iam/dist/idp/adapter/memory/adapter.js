"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const _ = tslib_1.__importStar(require("lodash"));
const adapter_1 = require("../adapter");
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
    async find(args) {
        let foundId = "";
        const argsId = args.id || args.claims && args.claims.sub;
        if (argsId) {
            const schema = await this.getClaimsSchema({ key: "sub", active: true });
            for (const [id, claims] of this.identityClaimsMap.entries()) {
                if (claims.some(c => c.key === "sub" && c.value === argsId && c.schemaVersion === schema.version)) {
                    foundId = id;
                    break;
                }
            }
        }
        else if (args.claims && args.claims.email) {
            const schema = await this.getClaimsSchema({ key: "email", active: true });
            for (const [id, claims] of this.identityClaimsMap.entries()) {
                if (claims.some(c => c.key === "email" && c.value === args.claims.email && c.schemaVersion === schema.version)) {
                    foundId = id;
                    break;
                }
            }
        }
        else if (args.claims && args.claims.phone_number) {
            const schema = await this.getClaimsSchema({ key: "phone_number", active: true });
            for (const [id, claims] of this.identityClaimsMap.entries()) {
                if (claims.some(c => c.key === "phone_number" && c.value === args.claims.phone_number && c.schemaVersion === schema.version)) {
                    foundId = id;
                    break;
                }
            }
        }
        if (foundId) {
            // filter by metadata for the common test
            if (args.metadata && !(await this.filerMetadata([foundId], args.metadata)).includes(foundId)) {
                return;
            }
            return foundId;
        }
    }
    // filter by metadata poorly for the common test
    async filerMetadata(ids, condition) {
        if (Object.keys(condition).length === 0)
            return ids;
        const filteredIds = [];
        for (const id of ids) {
            const metadata = await this.getMetadata(id);
            if (metadata && _.isMatch(metadata, condition)) {
                filteredIds.push(id);
            }
        }
        return filteredIds;
    }
    // only support offset, limit, metadata
    async get(args) {
        let ids = [...this.identityMetadataMap.keys()];
        // filter by metadata for the common test
        if (args.where && args.where.metadata) {
            ids = await this.filerMetadata(ids, args.where.metadata);
        }
        return ids
            .slice(args.offset || 0, typeof args.limit === "undefined" ? ids.length : args.limit);
    }
    async count(args) {
        return (await this.get(args)).length;
    }
    /* delete */
    async delete(id) {
        if (!this.identityMetadataMap.has(id))
            return false;
        this.identityMetadataMap.delete(id);
        this.identityClaimsMap.delete(id);
        this.identityCredentialsMap.delete(id);
        return true;
    }
    async createOrUpdateMetadata(id, metadata, transaction) {
        const old = this.identityMetadataMap.get(id);
        this.identityMetadataMap.set(id, _.defaultsDeep(metadata, old || {}));
    }
    async getMetadata(id) {
        return this.identityMetadataMap.get(id);
    }
    async createOrUpdateVersionedClaims(id, claims) {
        let oldClaims = this.identityClaimsMap.get(id);
        if (!oldClaims) {
            oldClaims = [];
            this.identityClaimsMap.set(id, oldClaims);
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
    }
    async onClaimsUpdated(id, updatedClaims, transaction) {
        // ...
    }
    async getVersionedClaims(id, claims) {
        const foundClaims = {};
        const storedClaims = this.identityClaimsMap.get(id) || [];
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
    }
    async createOrUpdateCredentials(id, credentials, transaction) {
        const cred = this.identityCredentialsMap.get(id);
        if (cred && JSON.stringify(cred) === JSON.stringify(credentials))
            return false;
        this.identityCredentialsMap.set(id, { ...cred, ...credentials });
        return true;
    }
    async assertCredentials(id, credentials) {
        const cred = this.identityCredentialsMap.get(id);
        if (!cred)
            return false;
        for (const [type, value] of Object.entries(credentials)) {
            if (cred[type] !== value)
                return false;
        }
        return true;
    }
    async createClaimsSchema(schema, transaction) {
        this.schemata.push(schema);
    }
    async forceDeleteClaimsSchema(key) {
        this.schemata = this.schemata.filter(schema => schema.key !== key);
    }
    async getClaimsSchema(args) {
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
    }
    async setActiveClaimsSchema(args, transaction) {
        const { key, version } = args;
        this.schemata.forEach(sch => {
            if (key !== sch.key)
                return;
            sch.active = version === sch.version;
        });
    }
    async getClaimsSchemata(args) {
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
    }
    /* transaction and migration lock for distributed system */
    async transaction() {
        const logger = this.logger;
        return {
            async commit() {
                logger.warn("Memory adapter has not implemented transaction: commit()");
            },
            async rollback() {
                logger.warn("Memory adapter has not implemented transaction: commit()");
            },
        };
    }
    async acquireMigrationLock(key) {
        if (this.migrationLocksMap.size > 0) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            return this.acquireMigrationLock(key);
        }
        this.migrationLocksMap.set(key, true);
    }
    async touchMigrationLock(key, migratedIdentitiesNumber) {
        // ...
        this.logger.warn("Memory adapter has not implemented dead lock resolving strategy, migration is working for: ", key, migratedIdentitiesNumber);
    }
    async releaseMigrationLock(key) {
        this.migrationLocksMap.delete(key);
    }
}
exports.IDP_MemoryAdapter = IDP_MemoryAdapter;
//# sourceMappingURL=adapter.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const _ = tslib_1.__importStar(require("lodash"));
const path_1 = tslib_1.__importDefault(require("path"));
const bcrypt_1 = tslib_1.__importDefault(require("bcrypt"));
const dataloader_1 = tslib_1.__importDefault(require("dataloader"));
const moment_1 = tslib_1.__importDefault(require("moment"));
const rdbms_1 = require("../../../helper/rdbms");
const adapter_1 = require("../adapter");
const model_1 = require("./model");
/* Postgres, MySQL, MariaDB, SQLite and Microsoft SQL Server supported */
// tslint:disable-next-line:class-name
class IDP_RDBMS_Adapter extends adapter_1.IDPAdapter {
    constructor(props, options) {
        super(props);
        this.props = props;
        this.displayName = "RDBMS";
        this.getVersionedClaimsLoader = new dataloader_1.default(async (entries) => {
            const where = {
                id: entries.map(entry => entry.id),
                key: [...new Set(entries.reduce((keys, entry) => keys.concat(entry.claims.map(c => c.key)), []))],
            };
            const foundClaimsList = new Array(entries.length).fill(null).map(() => ({}));
            const raws = await this.IdentityClaims.findAll({ where });
            for (const raw of raws) {
                const claim = raw.get({ plain: true });
                const entryIndex = entries.findIndex(e => e.id === claim.id);
                const entry = entries[entryIndex];
                const foundClaims = foundClaimsList[entryIndex];
                const specificVersion = entry.claims.find(c => c.key === claim.key).schemaVersion;
                if (typeof specificVersion === "undefined" || specificVersion === claim.schemaVersion) {
                    foundClaims[claim.key] = claim.value;
                }
            }
            return foundClaimsList;
        }, {
            cache: false,
            maxBatchSize: 100,
        });
        // create manager
        const { claimsMigrationLockTimeoutSeconds = 100, ...opts } = options || {};
        this.claimsMigrationLockTimeoutSeconds = claimsMigrationLockTimeoutSeconds;
        this.manager = new rdbms_1.RDBMSManager({
            logger: props.logger,
            migrationDirPath: path_1.default.join(__dirname, "./migrations"),
            migrationTableName: "idpMigrations",
        }, options);
    }
    /* define and migrate model schema */
    async start() {
        // await this.manager.rollback({ to: 0 }); // uncomment this line to develop migrations scripts
        await this.manager.migrate();
        // define models
        await model_1.defineAdapterModels(this.manager);
        await super.start();
    }
    async stop() {
        await this.manager.dispose();
        await super.stop();
    }
    /* fetch from synced cache */
    get IdentityCache() {
        return this.manager.getModel("IdentityCache");
    }
    // args will be like { claims:{}, metadata:{}, ... }
    async find(args) {
        return this.IdentityCache.findOne({ where: args, attributes: ["id"] })
            .then(raw => raw ? raw.get("id") : undefined);
    }
    // args will be like { claims:{}, metadata:{}, ... }
    async count(args) {
        return this.IdentityCache.count({ where: args });
    }
    // args will be like { where: { claims:{}, metadata:{}, ...}, offset: 0, limit: 100, ... }
    async get(args) {
        args.attributes = ["id"];
        return this.IdentityCache.findAll(args)
            .then(raws => raws.map(raw => raw.get("id")));
    }
    /* delete */
    async delete(id, transaction) {
        let isolated = false;
        if (!transaction) {
            transaction = await this.transaction();
            isolated = true;
        }
        try {
            const where = { id };
            let count = await this.IdentityMetadata.destroy({ where, transaction });
            count += await this.IdentityClaims.destroy({ where, transaction });
            count += await this.IdentityClaimsCache.destroy({ where, transaction });
            count += await this.IdentityCredentials.destroy({ where, transaction });
            if (isolated) {
                await transaction.commit();
            }
            return count > 0;
        }
        catch (error) {
            if (isolated) {
                await transaction.rollback();
            }
            throw error;
        }
    }
    /* metadata */
    get IdentityMetadata() {
        return this.manager.getModel("IdentityMetadata");
    }
    async createOrUpdateMetadata(id, metadata, transaction) {
        const [model, created] = await this.IdentityMetadata.findOrCreate({
            where: { id },
            defaults: { data: metadata },
            transaction,
        });
        if (!created) {
            await model.update({
                data: _.defaultsDeep(metadata, model.get({ plain: true }).data || {}),
            }, {
                transaction,
            });
        }
    }
    async getMetadata(id) {
        return this.IdentityMetadata.findOne({ where: { id } })
            .then(raw => raw ? raw.get("data") : undefined);
    }
    /* claims */
    get IdentityClaims() {
        return this.manager.getModel("IdentityClaims");
    }
    async createOrUpdateVersionedClaims(id, claims) {
        await this.IdentityClaims.bulkCreate(claims.map(({ key, value, schemaVersion }) => ({ id, key, schemaVersion, value })), {
            fields: ["id", "key", "schemaVersion", "value"],
            updateOnDuplicate: ["value"],
        });
    }
    async getVersionedClaims(id, claims) {
        return this.getVersionedClaimsLoader.load({ id, claims });
    }
    /* cache */
    get IdentityClaimsCache() {
        return this.manager.getModel("IdentityClaimsCache");
    }
    async onClaimsUpdated(id, updatedClaims, transaction) {
        const claims = await this.getClaims(id, []);
        const mergedClaims = _.defaultsDeep(updatedClaims, claims);
        // this.logger.debug("sync identity claims cache:", updatedClaims);
        await this.IdentityClaimsCache.upsert({
            id,
            data: mergedClaims,
        }, {
            transaction,
        });
    }
    /* credentials */
    get IdentityCredentials() {
        return this.manager.getModel("IdentityCredentials");
    }
    async createOrUpdateCredentials(id, credentials, transaction) {
        const hashedCredentials = {};
        // hash credentials
        if (credentials.password) {
            hashedCredentials.password = await bcrypt_1.default.hash(credentials.password, 10);
        }
        const [model, created] = await this.IdentityCredentials.findOrCreate({
            where: { id },
            defaults: hashedCredentials,
            transaction,
        });
        if (!created) {
            // not changed
            if (await this.assertCredentials(id, credentials)) {
                return false;
            }
            await model.update(hashedCredentials, { transaction });
        }
        return true;
    }
    async assertCredentials(id, credentials) {
        const model = await this.IdentityCredentials.findOne({ where: { id } });
        if (!model) {
            return false;
        }
        const hashedCredentials = model.get({ plain: true });
        if (credentials.password) {
            return bcrypt_1.default.compare(credentials.password, hashedCredentials.password)
                .catch(error => {
                this.logger.error(error);
                return false;
            });
        }
        this.logger.error(`unimplemented credentials type: ${Object.keys(credentials)}`);
        return false;
    }
    /* claims schema */
    get IdentityClaimsSchema() {
        return this.manager.getModel("IdentityClaimsSchema");
    }
    async createClaimsSchema(schema, transaction) {
        await this.IdentityClaimsSchema.upsert(schema, { transaction });
    }
    /*
    private serializeRegExpIncludedClaimsSchema(schema: IdentityClaimsSchema): IdentityClaimsSchema {
      if (schema.validation && (schema.validation as any).regexp && (schema.validation as any).regexp instanceof RegExp) {
        const schemaWithRegExp = _.cloneDeep(schema);
        (schemaWithRegExp.validation as any).regexp = (schema.validation as any).regexp.source.toString();
        return schemaWithRegExp;
      }
      return schema;
    }
  
    private unserializeRegExpIncludedClaimsSchema(schema: IdentityClaimsSchema): IdentityClaimsSchema {
      if (schema.validation && (schema.validation as any).regexp && !((schema.validation as any).regexp instanceof RegExp)) {
        const schemaWithRegExp = _.cloneDeep(schema);
        (schemaWithRegExp.validation as any).regexp = new RegExp((schema.validation as any).regexp);
        return schemaWithRegExp;
      }
      return schema;
    }
    */
    async forceDeleteClaimsSchema(key) {
        await this.IdentityClaimsSchema.destroy({ where: { key } });
    }
    async getClaimsSchema(args) {
        const { key, version, active } = args;
        const where = { key };
        if (typeof version !== "undefined") {
            where.version = version;
        }
        if (typeof active !== "undefined") {
            where.active = active;
        }
        return this.IdentityClaimsSchema
            .findOne({ where })
            .then(raw => raw ? raw.get({ plain: true }) : undefined);
    }
    async setActiveClaimsSchema(args, transaction) {
        const { key, version } = args;
        await this.IdentityClaimsSchema.update({ active: rdbms_1.Sequelize.literal(`version = '${version}'`) }, { where: { key }, fields: ["active"], transaction });
    }
    async getClaimsSchemata(args) {
        const { scope, key, version, active } = args;
        const where = {};
        if (scope.length !== 0) {
            where.scope = scope;
        }
        if (typeof key !== "undefined") {
            where.key = key;
        }
        if (typeof version !== "undefined") {
            where.version = version;
        }
        if (typeof active !== "undefined") {
            where.active = active;
        }
        return this.IdentityClaimsSchema
            .findAll({ where })
            .then(raws => raws.map(raw => raw.get({ plain: true })));
    }
    /* transaction and migration lock for distributed system */
    async transaction() {
        return this.manager.sequelize.transaction({
            autocommit: false,
            type: rdbms_1.Transaction.TYPES.DEFERRED,
            isolationLevel: rdbms_1.Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
        });
    }
    get IdentityClaimsMigrationLock() {
        return this.manager.getModel("IdentityClaimsMigrationLock");
    }
    async acquireMigrationLock(key) {
        const lock = await this.IdentityClaimsMigrationLock.findOne();
        if (lock) {
            const now = moment_1.default();
            const deadline = moment_1.default(lock.get("updatedAt")).add(this.claimsMigrationLockTimeoutSeconds, "s");
            // force release lock
            if (now.isAfter(deadline)) {
                const deadLockKey = lock.get("key");
                this.logger.info(`force release migration lock which is dead over ${this.claimsMigrationLockTimeoutSeconds} seconds:`, deadLockKey);
                await this.releaseMigrationLock(deadLockKey);
            }
            // acquire lock again
            this.logger.info(`retry to acquire migration lock after 5s: ${key}`);
            await new Promise(resolve => setTimeout(resolve, 5 * 1000));
            return this.acquireMigrationLock(key);
        }
        await this.IdentityClaimsMigrationLock.create({ key });
    }
    async touchMigrationLock(key, migratedIdentitiesNumber) {
        await this.IdentityClaimsMigrationLock.update({ number: migratedIdentitiesNumber }, { where: { key } });
    }
    async releaseMigrationLock(key) {
        await this.IdentityClaimsMigrationLock.destroy({ where: { key } });
    }
}
exports.IDP_RDBMS_Adapter = IDP_RDBMS_Adapter;
//# sourceMappingURL=adapter.js.map
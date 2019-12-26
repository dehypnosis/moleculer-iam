"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const _ = tslib_1.__importStar(require("lodash"));
const path_1 = tslib_1.__importDefault(require("path"));
const rdbms_1 = require("../../../helper/rdbms");
const adapter_1 = require("../adapter");
const identity_1 = require("../../identity");
const model_1 = require("./model");
const bcrypt_1 = tslib_1.__importDefault(require("bcrypt"));
const dataloader_1 = tslib_1.__importDefault(require("dataloader"));
/* Postgres, MySQL, MariaDB, SQLite and Microsoft SQL Server supported */
// tslint:disable-next-line:class-name
class IDP_RDBMS_Adapter extends adapter_1.IDPAdapter {
    constructor(props, options) {
        super(props);
        this.props = props;
        this.displayName = "RDBMS";
        this.getVersionedClaimsLoader = new dataloader_1.default((entries) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const where = {
                id: entries.map(entry => entry.identity.id),
                key: [...new Set(entries.reduce((keys, entry) => keys.concat(entry.claims.map(c => c.key)), []))],
            };
            const foundClaimsList = new Array(entries.length).fill(null).map(() => ({}));
            const raws = yield this.IdentityClaims.findAll({ where });
            for (const raw of raws) {
                const claim = raw.get({ plain: true });
                const entryIndex = entries.findIndex(e => e.identity.id === claim.id);
                const entry = entries[entryIndex];
                const foundClaims = foundClaimsList[entryIndex];
                const specificVersion = entry.claims.find(c => c.key === claim.key).schemaVersion;
                if (typeof specificVersion === "undefined" || specificVersion === claim.schemaVersion) {
                    foundClaims[claim.key] = claim.value;
                }
            }
            return foundClaimsList;
        }), {
            cache: false,
            maxBatchSize: 100,
        });
        // create manager
        this.manager = new rdbms_1.RDBMSManager({
            logger: props.logger,
            migrationDirPath: path_1.default.join(__dirname, "./migrations"),
            migrationTableName: "idpMigrations",
        }, options);
    }
    /* define and migrate model schema */
    start() {
        const _super = Object.create(null, {
            start: { get: () => super.start }
        });
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            // await this.manager.rollback({ to: 0 }); // uncomment this line to develop migrations scripts
            yield this.manager.migrate();
            // define models
            yield model_1.defineAdapterModels(this.manager);
            yield _super.start.call(this);
        });
    }
    stop() {
        const _super = Object.create(null, {
            stop: { get: () => super.stop }
        });
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.manager.dispose();
            yield _super.stop.call(this);
        });
    }
    /* fetch from synced cache */
    get IdentityCache() {
        return this.manager.getModel("IdentityCache");
    }
    // args will be like { claims:{}, metadata:{}, ... }
    find(args) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.IdentityCache.findOne({ where: args, attributes: ["id"] })
                .then(raw => {
                if (!raw) {
                    return;
                }
                return new identity_1.Identity({
                    id: raw.get("id"),
                    adapter: this,
                });
            });
        });
    }
    // args will be like { claims:{}, metadata:{}, ... }
    count(args) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.IdentityCache.count({ where: args });
        });
    }
    // args will be like { where: { claims:{}, metadata:{}, ...}, offset: 0, limit: 100, ... }
    get(args) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            args.attributes = ["id"];
            return this.IdentityCache.findAll(args)
                .then(raws => raws.map(raw => {
                return new identity_1.Identity({
                    id: raw.get("id"),
                    adapter: this,
                });
            }));
        });
    }
    /* delete */
    delete(identity) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const where = { id: identity.id };
            let count = yield this.IdentityMetadata.destroy({ where });
            count += yield this.IdentityClaims.destroy({ where });
            count += yield this.IdentityClaimsCache.destroy({ where });
            count += yield this.IdentityCredentials.destroy({ where });
            return count > 0;
        });
    }
    /* metadata */
    get IdentityMetadata() {
        return this.manager.getModel("IdentityMetadata");
    }
    createOrUpdateMetadata(identity, metadata, transaction) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const [model, created] = yield this.IdentityMetadata.findOrCreate({
                where: { id: identity.id },
                defaults: { data: metadata },
                transaction,
            });
            if (!created) {
                yield model.update({
                    data: _.defaultsDeep(metadata, model.get({ plain: true }).data || {}),
                }, {
                    transaction,
                });
            }
        });
    }
    getMetadata(identity) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.IdentityMetadata.findOne({ where: { id: identity.id } })
                .then(raw => raw ? raw.get("data") : undefined);
        });
    }
    /* claims */
    get IdentityClaims() {
        return this.manager.getModel("IdentityClaims");
    }
    createOrUpdateVersionedClaims(identity, claims) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.IdentityClaims.bulkCreate(claims.map(({ key, value, schemaVersion }) => ({ id: identity.id, key, schemaVersion, value })), {
                fields: ["id", "key", "schemaVersion", "value"],
                updateOnDuplicate: ["value"],
            });
        });
    }
    getVersionedClaims(identity, claims) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.getVersionedClaimsLoader.load({ identity, claims });
            // const where: WhereAttributeHash = {
            //   id: identity.id,
            //   key: claims.map(c => c.key),
            // };
            //
            // const foundClaims: Partial<OIDCAccountClaims> = {};
            // await this.IdentityClaims.findAll({where})
            //   .then(raws => {
            //     raws.forEach(raw => {
            //       const claim = raw.get({plain: true}) as { key: string, value: string, schemaVersion: string };
            //       const specificVersion = claims.find(c => c.key === claim.key)!.schemaVersion;
            //       if (typeof specificVersion === "undefined" || specificVersion === claim.schemaVersion) {
            //         foundClaims[claim.key] = claim.value;
            //       }
            //     });
            //   });
            //
            // return foundClaims;
        });
    }
    /* cache */
    get IdentityClaimsCache() {
        return this.manager.getModel("IdentityClaimsCache");
    }
    onClaimsUpdated(identity, transaction) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const claims = yield identity.claims();
            // this.logger.info("sync indentity claims cache:", claims);
            yield this.IdentityClaimsCache.upsert({
                id: identity.id,
                data: claims,
            }, {
                transaction,
            });
        });
    }
    /* credentials */
    get IdentityCredentials() {
        return this.manager.getModel("IdentityCredentials");
    }
    createOrUpdateCredentials(identity, credentials, transaction) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const hashedCredentials = {};
            // hash credentials
            if (credentials.password) {
                hashedCredentials.password = yield bcrypt_1.default.hash(credentials.password, 10);
            }
            const [model, created] = yield this.IdentityCredentials.findOrCreate({
                where: { id: identity.id },
                defaults: hashedCredentials,
                transaction,
            });
            if (!created) {
                // not changed
                if (yield this.assertCredentials(identity, credentials)) {
                    return false;
                }
                yield model.update(hashedCredentials, { transaction });
            }
            return true;
        });
    }
    assertCredentials(identity, credentials) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const model = yield this.IdentityCredentials.findOne({ where: { id: identity.id } });
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
        });
    }
    /* claims schema */
    get IdentityClaimsSchema() {
        return this.manager.getModel("IdentityClaimsSchema");
    }
    createClaimsSchema(schema, transaction) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.IdentityClaimsSchema.upsert(schema, { transaction });
        });
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
    forceDeleteClaimsSchema(key) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.IdentityClaimsSchema.destroy({ where: { key } });
        });
    }
    getClaimsSchema(args) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
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
        });
    }
    setActiveClaimsSchema(args, transaction) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { key, version } = args;
            yield this.IdentityClaimsSchema.update({ active: rdbms_1.Sequelize.literal(`version = '${version}'`) }, { where: { key }, fields: ["active"], transaction });
        });
    }
    getClaimsSchemata(args) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
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
        });
    }
    /* transaction and migration lock for distributed system */
    transaction() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.manager.sequelize.transaction({
                autocommit: false,
                type: rdbms_1.Transaction.TYPES.DEFERRED,
                isolationLevel: rdbms_1.Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
            });
        });
    }
    get IdentityClaimsMigrationLock() {
        return this.manager.getModel("IdentityClaimsMigrationLock");
    }
    acquireMigrationLock(key) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const [lock, created] = yield this.IdentityClaimsMigrationLock.findOrCreate({ where: { key } });
            // old lock found
            if (!created) {
                this.logger.info(`retry to acquire migration lock after 5s: ${key}`);
                yield new Promise(resolve => setTimeout(resolve, 5 * 1000));
                return this.acquireMigrationLock(key);
            }
        });
    }
    releaseMigrationLock(key) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.IdentityClaimsMigrationLock.destroy({ where: { key } });
        });
    }
}
exports.IDP_RDBMS_Adapter = IDP_RDBMS_Adapter;
//# sourceMappingURL=adapter.js.map
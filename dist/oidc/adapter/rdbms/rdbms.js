"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const rdbms_1 = require("../../../helper/rdbms");
const adapter_1 = require("../adapter");
const path_1 = tslib_1.__importDefault(require("path"));
const model_1 = require("./model");
/* Postgres, MySQL, MariaDB, SQLite and Microsoft SQL Server supported */
let manager;
let migrated = false;
function getEntryData(entry) {
    return Object.assign(Object.assign({}, entry.data), (entry.consumedAt ? { consumed: true } : undefined));
}
class OIDCModelRDBMSAdapter extends adapter_1.OIDCModelAdapter {
    constructor(props, options) {
        super(props);
        this.props = props;
        // initialize DBMS
        if (!manager) {
            // create manager
            manager = new rdbms_1.RDBMSManager({
                logger: props.logger,
                migrationDirPath: path_1.default.join(__dirname, "./migrations"),
                migrationTableName: "oidcProviderMigrations",
            }, options);
            // define models
            model_1.defineModels(manager);
        }
        this.model = manager.model(this.name);
    }
    /* define and migrate model schema */
    start() {
        const _super = Object.create(null, {
            start: { get: () => super.start }
        });
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            // try migration (all models in a batch)
            if (!migrated) {
                // await manager.rollback(); // uncomment this line to develop migrations scripts
                yield manager.migrate();
                migrated = true;
            }
            yield _super.start.call(this);
        });
    }
    consume(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.model.update({ consumedAt: new Date() }, { where: { id } });
        });
    }
    count(...args) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.model.count();
        });
    }
    destroy(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.model.destroy({ where: { id } });
        });
    }
    find(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const found = yield this.model.findByPk(id);
            if (!found) {
                return undefined;
            }
            return getEntryData(found);
        });
    }
    findByUid(uid) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const found = yield this.model.findOne({ where: { uid } });
            if (!found) {
                return undefined;
            }
            return getEntryData(found);
        });
    }
    findByUserCode(userCode) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const found = yield this.model.findOne({ where: { userCode } });
            if (!found) {
                return undefined;
            }
            return getEntryData(found);
        });
    }
    get(opts) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!opts)
                opts = {};
            if (typeof opts.offset === "undefined")
                opts.offset = 0;
            if (typeof opts.limit === "undefined")
                opts.limit = 10;
            const founds = yield this.model.findAll(opts);
            return founds.map(getEntryData);
        });
    }
    revokeByGrantId(grantId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.model.destroy({ where: { grantId } });
        });
    }
    upsert(id, data, expiresIn) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.model.upsert(Object.assign(Object.assign(Object.assign(Object.assign({ id,
                data }, (data.grantId ? { grantId: data.grantId } : undefined)), (data.userCode ? { userCode: data.userCode } : undefined)), (data.uid ? { uid: data.uid } : undefined)), (expiresIn ? { expiresAt: new Date(Date.now() + (expiresIn * 1000)) } : undefined)));
        });
    }
}
exports.OIDCModelRDBMSAdapter = OIDCModelRDBMSAdapter;
//# sourceMappingURL=rdbms.js.map
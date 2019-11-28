"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path_1 = tslib_1.__importDefault(require("path"));
const rdbms_1 = require("../../../helper/rdbms");
const adapter_1 = require("../adapter");
const model_1 = require("../model");
const model_2 = require("./model");
const { STRING, JSON, DATE } = rdbms_1.DataTypes;
/* Postgres, MySQL, MariaDB, SQLite and Microsoft SQL Server supported */
// tslint:disable-next-line:class-name
class OIDC_RDBMS_Adapter extends adapter_1.OIDCAdapter {
    constructor(props, options) {
        super(props);
        this.props = props;
        // create manager
        this.manager = new rdbms_1.RDBMSManager({
            logger: props.logger,
            migrationDirPath: path_1.default.join(__dirname, "./migrations"),
            migrationTableName: "oidcProviderMigrations",
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
    createModel(name) {
        const model = this.manager.define(name, Object.assign(Object.assign(Object.assign(Object.assign({ id: { type: STRING, primaryKey: true } }, (model_1.OIDCGrantModelNames.includes(name) ? { grantId: { type: STRING } } : undefined)), (name === "DeviceCode" ? { userCode: { type: STRING } } : undefined)), (name === "Session" ? { uid: { type: STRING } } : undefined)), { data: { type: JSON }, expiresAt: { type: DATE }, consumedAt: { type: DATE } }), {
            freezeTableName: true,
            timestamps: true,
            paranoid: false,
            charset: "utf8",
            collate: "utf8_general_ci",
        });
        return new model_2.OIDC_RDBMS_Model({
            name,
            logger: this.logger,
        }, model);
    }
}
exports.OIDC_RDBMS_Adapter = OIDC_RDBMS_Adapter;
//# sourceMappingURL=adapter.js.map
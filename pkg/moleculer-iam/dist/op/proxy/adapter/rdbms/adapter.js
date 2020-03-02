"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path_1 = tslib_1.__importDefault(require("path"));
const rdbms_1 = require("../../../../helper/rdbms");
const adapter_1 = require("../adapter");
const model_1 = require("../model");
const model_2 = require("./model");
const { STRING, JSON, DATE } = rdbms_1.DataTypes;
/* Postgres, MySQL, MariaDB, SQLite and Microsoft SQL Server supported */
// tslint:disable-next-line:class-name
class OIDCRDBMSAdapterProxy extends adapter_1.OIDCAdapterProxy {
    constructor(props, options) {
        super(props);
        this.props = props;
        this.displayName = "RDBMS";
        // create manager
        this.manager = new rdbms_1.RDBMSManager({
            logger: props.logger,
            migrationDirPath: path_1.default.join(__dirname, "./migrations"),
            migrationTableName: "oidcProviderMigrations",
        }, options);
    }
    /* define and migrate model schema */
    async start() {
        // await this.manager.rollback({ to: 0 }); // uncomment this line to develop migrations scripts
        await this.manager.migrate();
        await super.start();
    }
    async stop() {
        await this.manager.dispose();
        await super.stop();
    }
    createModel(props) {
        const { name } = props;
        const model = this.manager.define(name, {
            id: { type: STRING, primaryKey: true },
            ...(model_1.OIDCGrantModelNames.includes(name) ? { grantId: { type: STRING } } : undefined),
            ...(name === "DeviceCode" ? { userCode: { type: STRING } } : undefined),
            ...(name === "Session" ? { uid: { type: STRING } } : undefined),
            data: { type: JSON },
            expiresAt: { type: DATE },
            consumedAt: { type: DATE },
        }, {
            freezeTableName: true,
            timestamps: true,
            paranoid: false,
            charset: "utf8",
            collate: "utf8_general_ci",
        });
        return new model_2.OIDCRDBMSModelProxy(props, model);
    }
}
exports.OIDCRDBMSAdapterProxy = OIDCRDBMSAdapterProxy;
//# sourceMappingURL=adapter.js.map
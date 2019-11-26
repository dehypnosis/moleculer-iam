"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const kleur = tslib_1.__importStar(require("kleur"));
const _ = tslib_1.__importStar(require("lodash"));
const umzug_1 = tslib_1.__importDefault(require("umzug"));
const sequelize_1 = require("sequelize");
exports.DataTypes = sequelize_1.DataTypes;
const readline_1 = tslib_1.__importDefault(require("readline"));
const rl = readline_1.default.createInterface(process.stdin, process.stdout);
const DontSync = (() => {
    throw new Error("shall not use sync: try to create migration scripts!");
});
class RDBMSManager {
    constructor(props, opts = {}) {
        this.props = props;
        this.models = new Map();
        this.logger = props.logger || console;
        // apply default options (update source object to use as reference in a map)
        const log = this.logger[opts.sqlLogLevel || "debug"] || this.logger.debug;
        const defaults = {
            logging: (sql) => log(sql),
            logQueryParameters: true,
            benchmark: true,
        };
        _.defaultsDeep(opts, defaults);
        // get sequelize instance
        const seq = this.seq = new sequelize_1.Sequelize(opts);
        // create migrator
        this.migrator = new umzug_1.default({
            storage: "sequelize",
            storageOptions: {
                sequelize: this.seq,
                tableName: this.props.migrationTableName || "sequelize",
            },
            migrations: {
                params: [
                    this.seq.getQueryInterface(),
                    sequelize_1.Sequelize,
                ],
                path: this.props.migrationDirPath || __dirname,
            },
        });
    }
    define(name, attr, opts) {
        const model = this.seq.define(name, attr, opts);
        model.sync = DontSync;
        this.models.set(name, model);
        return model;
    }
    getModel(name) {
        return this.models.get(name);
    }
    migrate(opts) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const results = yield this.migrator.up(opts);
            for (const r of results) {
                this.logger.info(`${this.props.migrationTableName}: ${kleur.green(r.file)} migrated`);
            }
        });
    }
    rollback(opts) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            // safety bar
            console.log(kleur.bgRed(`
============================[ROLLBACK COMMAND INVOKED]====================================
 ROLLBACK IS DESTRUCTIVE COMMAND. BE CAREFUL TO NOT TO BEING DEPLOYED ON PRODUCTION AS IS
==========================================================================================`));
            return new Promise((resolve, reject) => {
                rl.question("CONTINUE? (yes/no)\n", (answer) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    try {
                        if (typeof answer === "string" && ["yes", "y"].includes(answer.toLowerCase())) {
                            const results = yield this.migrator.down(opts);
                            for (const r of results) {
                                this.logger.info(`${this.props.migrationTableName}: ${kleur.yellow(r.file)} rollbacked`);
                            }
                        }
                        else {
                            this.logger.info(`${this.props.migrationTableName}: rollback canceled`);
                        }
                        resolve();
                    }
                    catch (error) {
                        reject(error);
                    }
                }));
            });
        });
    }
}
exports.RDBMSManager = RDBMSManager;
//# sourceMappingURL=rdbms.js.map
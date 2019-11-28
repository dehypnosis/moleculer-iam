"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const kleur = tslib_1.__importStar(require("kleur"));
const _ = tslib_1.__importStar(require("lodash"));
const readline_1 = tslib_1.__importDefault(require("readline"));
const umzug_1 = tslib_1.__importDefault(require("umzug"));
const sequelize_1 = require("sequelize");
// ref: https://sequelize.org/v5/manual/
var sequelize_2 = require("sequelize");
exports.DataTypes = sequelize_2.DataTypes;
const DontSync = (() => {
    throw new Error("shall not use sync: try to create migration scripts!");
});
const rl = readline_1.default.createInterface(process.stdin, process.stdout);
class RDBMSManager {
    constructor(props, opts = {}) {
        this.props = props;
        this.opts = opts;
        this.models = new Map();
        this.logger = props.logger || console;
        // apply default options
        const log = this.logger[opts.sqlLogLevel || "debug"] || this.logger.debug;
        const defaults = {
            logging: (sql) => log(sql),
            logQueryParameters: true,
            benchmark: true,
            migrationLockTimeoutSeconds: 30,
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
            yield this.acquireLock(() => tslib_1.__awaiter(this, void 0, void 0, function* () {
                const results = yield this.migrator.up(opts);
                for (const r of results) {
                    this.logger.info(`${this.migrationTableLabel}: ${kleur.green(r.file)} migrated`);
                }
            }));
        });
    }
    rollback(opts) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            // safety bar
            console.log(kleur.bgRed(`
============================[ROLLBACK COMMAND INVOKED]====================================
       ROLLBACK IS A DESTRUCTIVE COMMAND. BE CAREFUL TO NOT TO BEING DEPLOYED AS IS
==========================================================================================`));
            console.log();
            return new Promise((resolve, reject) => {
                rl.question(`Rollback ${this.migrationTableLabel} with option ${opts ? JSON.stringify(opts) : "(ALL)"}? (yes/y)\n`, (answer) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    try {
                        if (typeof answer === "string" && ["yes", "y"].includes(answer.toLowerCase())) {
                            yield this.acquireLock(() => tslib_1.__awaiter(this, void 0, void 0, function* () {
                                const results = yield this.migrator.down(opts);
                                for (const r of results) {
                                    this.logger.info(`${this.migrationTableLabel}: ${kleur.yellow(r.file)} rollbacked`);
                                }
                            }));
                        }
                        else {
                            this.logger.info(`${this.migrationTableLabel}: rollback canceled`);
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
    dispose() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.releaseLock();
            yield this.seq.close();
        });
    }
    /* migration locking for distributed envrionment */
    get lockTableName() {
        return this.props.migrationTableName + "_LOCK";
    }
    get migrationTableLabel() {
        return kleur.blue(this.props.migrationTableName);
    }
    acquireLock(task, deadLockTimer = this.opts.migrationLockTimeoutSeconds * 1000) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            // acquire lock
            try {
                const table = yield this.seq.getQueryInterface().describeTable(this.lockTableName);
                // check deadlock
                try {
                    const [rows] = yield this.seq.getQueryInterface().sequelize.query(`select * from ${this.lockTableName}`);
                    const row = rows[0];
                    if (!row || new Date(row.tableCreatedAt).getTime() < Date.now() - 1000 * 30) {
                        this.logger.info(`${this.migrationTableLabel}: release previous migration lock which is incomplete or dead for ${this.opts.migrationLockTimeoutSeconds}s`);
                        yield this.releaseLock();
                        return this.acquireLock(task);
                    }
                }
                catch (_a) { }
                // if lock table exists, retry after 5-10s
                const waitTime = Math.ceil(10000 * (Math.random() + 0.5));
                deadLockTimer -= waitTime;
                this.logger.warn(`${this.migrationTableLabel}: failed to acquire migration lock, retry after ${waitTime}ms, force release lock in ${Math.ceil(deadLockTimer / 1000)}s`);
                yield new Promise(resolve => setTimeout(resolve, waitTime));
                return this.acquireLock(task, deadLockTimer);
            }
            catch (error) {
                // there are no lock table, try to create table
                yield this.seq.getQueryInterface().createTable(this.lockTableName, {
                    tableCreatedAt: sequelize_1.STRING,
                });
                yield this.seq.getQueryInterface().sequelize.query(`insert into ${this.lockTableName} values("${new Date().toISOString()}")`);
                this.logger.info(`${this.migrationTableLabel}: migration lock acquired`);
            }
            // do task and release lock
            try {
                yield task();
            }
            catch (error) {
                throw error;
            }
            finally {
                yield this.releaseLock();
            }
        });
    }
    releaseLock(silent = false) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                yield this.seq.getQueryInterface().dropTable(this.lockTableName);
                this.logger.info(`${this.migrationTableLabel}: migration lock released`);
            }
            catch (error) {
                this.logger.error(`${this.migrationTableLabel}: failed to release migration lock`, error);
            }
        });
    }
}
exports.RDBMSManager = RDBMSManager;
//# sourceMappingURL=rdbms.js.map
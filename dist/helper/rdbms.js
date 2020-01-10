"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const kleur = tslib_1.__importStar(require("kleur"));
const _ = tslib_1.__importStar(require("lodash"));
const readline_1 = tslib_1.__importDefault(require("readline"));
const umzug_1 = tslib_1.__importDefault(require("umzug"));
const sequelize_1 = require("sequelize");
// ignore deprecation warning for string operator alias
// tslint:disable-next-line:no-var-requires
require("sequelize/lib/utils/deprecations").noStringOperators = () => { };
// ref: https://sequelize.org/v5/manual/
tslib_1.__exportStar(require("sequelize"), exports);
const DontSync = (() => {
    throw new Error("shall not use sync: try to create migration scripts!");
});
class RDBMSManager {
    constructor(props, opts = {}) {
        this.props = props;
        this.opts = opts;
        this.models = new Map();
        this.rl = readline_1.default.createInterface(process.stdin, process.stdout);
        this.logger = props.logger || console;
        // apply default options
        const log = opts.sqlLogLevel === "none" ? () => {
        } : (this.logger[opts.sqlLogLevel || "debug"] || this.logger.debug);
        const defaults = {
            logging: (sql) => log(sql),
            logQueryParameters: true,
            benchmark: true,
            migrationLockTimeoutSeconds: 10,
            operatorsAliases: RDBMSManager.operatorsAliases,
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
    get sequelize() {
        return this.seq;
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
==========================================================================================`) + "\n");
            return new Promise((resolve, reject) => {
                this.rl.question(`Rollback ${this.migrationTableLabel} with option ${opts ? JSON.stringify(opts) : "(ALL)"}? (yes/y)\n`, (answer) => tslib_1.__awaiter(this, void 0, void 0, function* () {
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
            this.rl.close();
        });
    }
    /* migration locking for distributed envrionment */
    get lockTableName() {
        return this.props.migrationTableName + "_LOCK";
    }
    get migrationTableLabel() {
        return kleur.green(this.props.migrationTableName);
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
                    if (!row || new Date(row.tableCreatedAt).getTime() < Date.now() - 1000 * 30 || deadLockTimer <= 0) {
                        this.logger.info(`${this.migrationTableLabel} will release previous lock which is incomplete or dead for ${this.opts.migrationLockTimeoutSeconds}s`);
                        yield this.releaseLock();
                        return this.acquireLock(task);
                    }
                }
                catch (_a) {
                }
                // if lock table exists, retry after 5-10s
                const waitTime = Math.ceil(5000 * (Math.random() + 1));
                deadLockTimer -= waitTime;
                this.logger.warn(`${this.migrationTableLabel} failed to acquire migration lock, retry after ${waitTime}ms, force release lock in ${Math.ceil(deadLockTimer / 1000)}s`);
                yield new Promise(resolve => setTimeout(resolve, waitTime));
                return this.acquireLock(task, deadLockTimer);
            }
            catch (error) {
                // there are no lock table, try to create table
                yield this.seq.getQueryInterface().createTable(this.lockTableName, {
                    tableCreatedAt: sequelize_1.STRING,
                });
                yield this.seq.getQueryInterface().sequelize.query(`insert into ${this.lockTableName} values("${new Date().toISOString()}")`);
                this.logger.info(`${this.migrationTableLabel} lock acquired`);
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
                this.logger.info(`${this.migrationTableLabel} lock released`);
            }
            catch (error) {
                this.logger.error(`${this.migrationTableLabel} failed to release migration lock`, error);
            }
        });
    }
}
exports.RDBMSManager = RDBMSManager;
RDBMSManager.operatorsAliases = {
    $eq: sequelize_1.Op.eq,
    $ne: sequelize_1.Op.ne,
    $gte: sequelize_1.Op.gte,
    $gt: sequelize_1.Op.gt,
    $lte: sequelize_1.Op.lte,
    $lt: sequelize_1.Op.lt,
    $not: sequelize_1.Op.not,
    $in: sequelize_1.Op.in,
    $notIn: sequelize_1.Op.notIn,
    $is: sequelize_1.Op.is,
    $like: sequelize_1.Op.like,
    $notLike: sequelize_1.Op.notLike,
    $iLike: sequelize_1.Op.iLike,
    $notILike: sequelize_1.Op.notILike,
    $regexp: sequelize_1.Op.regexp,
    $notRegexp: sequelize_1.Op.notRegexp,
    $iRegexp: sequelize_1.Op.iRegexp,
    $notIRegexp: sequelize_1.Op.notIRegexp,
    $between: sequelize_1.Op.between,
    $notBetween: sequelize_1.Op.notBetween,
    $overlap: sequelize_1.Op.overlap,
    $contains: sequelize_1.Op.contains,
    $contained: sequelize_1.Op.contained,
    $adjacent: sequelize_1.Op.adjacent,
    $strictLeft: sequelize_1.Op.strictLeft,
    $strictRight: sequelize_1.Op.strictRight,
    $noExtendRight: sequelize_1.Op.noExtendRight,
    $noExtendLeft: sequelize_1.Op.noExtendLeft,
    $and: sequelize_1.Op.and,
    $or: sequelize_1.Op.or,
    $any: sequelize_1.Op.any,
    $all: sequelize_1.Op.all,
    $values: sequelize_1.Op.values,
    $col: sequelize_1.Op.col,
};
//# sourceMappingURL=rdbms.js.map
import * as kleur from "kleur";
import * as _ from "lodash";
import readline from "readline";
import Umzug, { DownToOptions, UpDownMigrationsOptions, UpToOptions } from "umzug";
import { Sequelize, Options, Model, ModelAttributes, ModelOptions, STRING } from "sequelize";
import { Logger, LogLevel } from "../logger";

// ref: https://sequelize.org/v5/manual/

export * from "sequelize";

export type RDBMSManagerProps = {
  migrationTableName: string,
  migrationDirPath: string,
  logger?: Logger,
};

export type RDBMSManagerOptions = Omit<Options, "define" | "query" | "set" | "sync" | "operatorsAliases" | "minifyAliases" | "hooks" | "logging"> & {
  sqlLogLevel?: LogLevel | "none",
  migrationLockTimeoutSeconds?: number,
};

export type ModelClass = typeof Model & (new() => Model) & { sync: never };

const DontSync = (() => {
  throw new Error("shall not use sync: try to create migration scripts!");
}) as never;

export class RDBMSManager {
  private readonly seq: Sequelize;
  private readonly migrator: Umzug.Umzug;
  private readonly logger: Logger;
  private readonly models = new Map<string, ModelClass>();
  private readonly rl = readline.createInterface(process.stdin, process.stdout);

  constructor(private readonly props: RDBMSManagerProps, private readonly opts: RDBMSManagerOptions = {}) {
    this.logger = props.logger || console;

    // apply default options
    const log = opts.sqlLogLevel === "none" ? () => {
    } : (this.logger[opts.sqlLogLevel || "debug"] || this.logger.debug);
    const defaults: Options & RDBMSManagerOptions = {
      logging: (sql: string) => log(sql),
      logQueryParameters: true,
      benchmark: true,
      migrationLockTimeoutSeconds: 10,
    };
    _.defaultsDeep(opts, defaults);

    // get sequelize instance
    const seq = this.seq = new Sequelize(opts);

    // create migrator
    this.migrator = new Umzug({
      storage: "sequelize",

      storageOptions: {
        sequelize: this.seq,
        tableName: this.props.migrationTableName || "sequelize",
      },

      migrations: {
        params: [
          this.seq.getQueryInterface(),
          Sequelize,
        ],
        path: this.props.migrationDirPath || __dirname,
      },
    });
  }

  public get sequelize() {
    return this.seq;
  }

  public define(name: string, attr: ModelAttributes, opts?: ModelOptions): ModelClass {
    const model = this.seq.define(name, attr, opts) as ModelClass;
    model.sync = DontSync;
    this.models.set(name, model);
    return model;
  }

  public getModel(name: string): ModelClass | undefined {
    return this.models.get(name);
  }

  public async migrate(opts?: UpToOptions | UpDownMigrationsOptions) {
    await this.acquireLock(async () => {
      const results = await this.migrator.up(opts);
      for (const r of results) {
        this.logger.info(`${this.migrationTableLabel}: ${kleur.green(r.file)} migrated`);
      }
    });
  }

  public async rollback(opts?: DownToOptions | UpDownMigrationsOptions) {
    // safety bar
    console.log(kleur.bgRed(`
============================[ROLLBACK COMMAND INVOKED]====================================
       ROLLBACK IS A DESTRUCTIVE COMMAND. BE CAREFUL TO NOT TO BEING DEPLOYED AS IS
==========================================================================================`) + "\n");

    return new Promise((resolve, reject) => {
      this.rl.question(`Rollback ${this.migrationTableLabel} with option ${opts ? JSON.stringify(opts) : "(ALL)"}? (yes/y)\n`, async (answer: any) => {
        try {
          if (typeof answer === "string" && ["yes", "y"].includes(answer.toLowerCase())) {
            await this.acquireLock(async () => {
              const results = await this.migrator.down(opts);
              for (const r of results) {
                this.logger.info(`${this.migrationTableLabel}: ${kleur.yellow(r.file)} rollbacked`);
              }
            });
          } else {
            this.logger.info(`${this.migrationTableLabel}: rollback canceled`);
          }
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  public async dispose() {
    await this.releaseLock();
    await this.seq.close();
    this.rl.close();
  }

  /* migration locking for distributed envrionment */
  private get lockTableName() {
    return this.props.migrationTableName + "_LOCK";
  }

  private get migrationTableLabel() {
    return kleur.green(this.props.migrationTableName);
  }

  private async acquireLock(task: () => Promise<void>, deadLockTimer = this.opts.migrationLockTimeoutSeconds! * 1000): Promise<void> {
    // acquire lock
    try {
      const table = await this.seq.getQueryInterface().describeTable(this.lockTableName);

      // check deadlock
      try {
        const [rows] = await this.seq.getQueryInterface().sequelize.query(`select * from ${this.lockTableName}`);
        const row: any = rows[0];
        if (!row || new Date(row.tableCreatedAt).getTime() < Date.now() - 1000 * 30 || deadLockTimer <= 0) {
          this.logger.info(`${this.migrationTableLabel} will release previous lock which is incomplete or dead for ${this.opts.migrationLockTimeoutSeconds!}s`);
          await this.releaseLock();
          return this.acquireLock(task);
        }
      } catch {
      }

      // if lock table exists, retry after 5-10s
      const waitTime = Math.ceil(5000 * (Math.random() + 1));
      deadLockTimer -= waitTime;
      this.logger.warn(`${this.migrationTableLabel} failed to acquire migration lock, retry after ${waitTime}ms, force release lock in ${Math.ceil(deadLockTimer / 1000)}s`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      return this.acquireLock(task, deadLockTimer);
    } catch (error) {
      // there are no lock table, try to create table
      await this.seq.getQueryInterface().createTable(this.lockTableName, {
        tableCreatedAt: STRING,
      });
      await this.seq.getQueryInterface().sequelize.query(`insert into ${this.lockTableName} values("${new Date().toISOString()}")`);
      this.logger.info(`${this.migrationTableLabel} lock acquired`);
    }

    // do task and release lock
    try {
      await task();
    } catch (error) {
      throw error;
    } finally {
      await this.releaseLock();
    }
  }

  private async releaseLock(silent = false) {
    try {
      await this.seq.getQueryInterface().dropTable(this.lockTableName);
      this.logger.info(`${this.migrationTableLabel} lock released`);
    } catch (error) {
      this.logger.error(`${this.migrationTableLabel} failed to release migration lock`, error);
    }
  }
}

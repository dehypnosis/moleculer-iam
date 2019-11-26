import * as kleur from "kleur";
import * as _ from "lodash";
import Umzug, { DownToOptions, UpDownMigrationsOptions, UpToOptions } from "umzug";
import { Sequelize, Options, Model, ModelAttributes, ModelOptions, DataTypes, FindOptions } from "sequelize";
import { Logger, LogLevel } from "../logger";
import readline from "readline";
const rl = readline.createInterface(process.stdin, process.stdout);

// ref: https://sequelize.org/v5/manual/

export { DataTypes, FindOptions };

export type RDBMSManagerProps = {
  migrationTableName: string,
  migrationDirPath: string,
  logger?: Logger,
};

export type RDBMSManagerOptions = Omit<Options, "define" | "query" | "set" | "sync" | "operatorsAliases" | "minifyAliases" | "hooks" | "logging"> & {
  sqlLogLevel?: LogLevel,
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

  constructor(private readonly props: RDBMSManagerProps, opts: RDBMSManagerOptions = {}) {
    this.logger = props.logger || console;

    // apply default options (update source object to use as reference in a map)
    const log = this.logger[opts.sqlLogLevel || "debug"] || this.logger.debug;
    const defaults: Options = {
      logging: (sql: string) => log(sql),
      logQueryParameters: true,
      benchmark: true,
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
    const results = await this.migrator.up(opts);
    for (const r of results) {
      this.logger.info(`${this.props.migrationTableName}: ${kleur.green(r.file)} migrated`);
    }
  }

  public async rollback(opts?: DownToOptions | UpDownMigrationsOptions) {
    // safety bar
    console.log(kleur.bgRed(`
============================[ROLLBACK COMMAND INVOKED]====================================
 ROLLBACK IS DESTRUCTIVE COMMAND. BE CAREFUL TO NOT TO BEING DEPLOYED ON PRODUCTION AS IS
==========================================================================================`));

    return new Promise((resolve, reject) => {
      rl.question("CONTINUE? (yes/no)\n", async (answer: any) => {
        try {
          if (typeof answer === "string" && ["yes", "y"].includes(answer.toLowerCase())) {
            const results = await this.migrator.down(opts);
            for (const r of results) {
              this.logger.info(`${this.props.migrationTableName}: ${kleur.yellow(r.file)} rollbacked`);
            }
          } else {
            this.logger.info(`${this.props.migrationTableName}: rollback canceled`);
          }
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  public async dispose() {
    await this.seq.close();
  }
}

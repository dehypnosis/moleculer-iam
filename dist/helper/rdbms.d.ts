import { DownToOptions, UpDownMigrationsOptions, UpToOptions } from "umzug";
import { Options, Model, ModelAttributes, ModelOptions } from "sequelize";
import { Logger, LogLevel } from "../logger";
export { DataTypes, FindOptions } from "sequelize";
export declare type RDBMSManagerProps = {
    migrationTableName: string;
    migrationDirPath: string;
    logger?: Logger;
};
export declare type RDBMSManagerOptions = Omit<Options, "define" | "query" | "set" | "sync" | "operatorsAliases" | "minifyAliases" | "hooks" | "logging"> & {
    sqlLogLevel?: LogLevel;
    migrationLockTimeoutSeconds?: number;
};
export declare type ModelClass = typeof Model & (new () => Model) & {
    sync: never;
};
export declare class RDBMSManager {
    private readonly props;
    private readonly opts;
    private readonly seq;
    private readonly migrator;
    private readonly logger;
    private readonly models;
    constructor(props: RDBMSManagerProps, opts?: RDBMSManagerOptions);
    define(name: string, attr: ModelAttributes, opts?: ModelOptions): ModelClass;
    getModel(name: string): ModelClass | undefined;
    migrate(opts?: UpToOptions | UpDownMigrationsOptions): Promise<void>;
    rollback(opts?: DownToOptions | UpDownMigrationsOptions): Promise<unknown>;
    dispose(): Promise<void>;
    private readonly lockTableName;
    private readonly migrationTableLabel;
    private acquireLock;
    private releaseLock;
}

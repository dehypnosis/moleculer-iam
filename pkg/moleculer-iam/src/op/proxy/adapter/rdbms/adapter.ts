import path from "path";
import { DataTypes, RDBMSManager, RDBMSManagerOptions } from "../../../../lib/rdbms";
import { OIDCAdapterProxy, OIDCAdapterProxyProps } from "../adapter";
import { OIDCGrantModelNames, OIDCModelProxyProps } from "../model";
import { OIDCRDBMSModelProxy } from "./model";

const {STRING, JSON, DATE} = DataTypes;

export type OIDCRDBMSAdapterProxyOptions = RDBMSManagerOptions;

/* Postgres, MySQL, MariaDB, SQLite and Microsoft SQL Server supported */

// tslint:disable-next-line:class-name
export class OIDCRDBMSAdapterProxy extends OIDCAdapterProxy {
  private readonly manager: RDBMSManager;
  public readonly displayName = "RDBMS";

  constructor(protected readonly props: OIDCAdapterProxyProps, options?: OIDCRDBMSAdapterProxyOptions) {
    super(props);

    // create manager
    this.manager = new RDBMSManager({
      logger: props.logger,
      migrationDirPath: path.join(__dirname, "./migrations"),
      migrationTableName: "oidcProviderMigrations",
    }, options);
  }

  /* define and migrate model schema */
  public async start(): Promise<void> {
    // await this.manager.rollback({ to: 0 }); // uncomment this line to develop migrations scripts
    await this.manager.migrate();
    await super.start();
  }

  public async stop() {
    await this.manager.dispose();
    await super.stop();
  }

  protected createModel(props: OIDCModelProxyProps): OIDCRDBMSModelProxy {

    const { name } = props;
    const model = this.manager.define(name, {
      id: {type: STRING, primaryKey: true},
      ...(OIDCGrantModelNames.includes(name) ? {grantId: {type: STRING}} : undefined),
      ...(name === "DeviceCode" ? {userCode: {type: STRING}} : undefined),
      ...(name === "Session" ? {uid: {type: STRING}} : undefined),
      data: {type: JSON},
      expiresAt: {type: DATE},
      consumedAt: {type: DATE},
    }, {
      freezeTableName: true, // do not humanize model name for creating table
      timestamps: true, // createdAt, updatedAt
      paranoid: false, // deletedAt
      charset: "utf8",
      collate: "utf8_general_ci",
    });

    return new OIDCRDBMSModelProxy(props, model);
  }
}

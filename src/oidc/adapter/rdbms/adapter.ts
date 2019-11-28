import path from "path";
import { DataTypes, RDBMSManager, RDBMSManagerOptions } from "../../../helper/rdbms";
import { OIDCAdapter, OIDCAdapterProps } from "../adapter";
import { OIDCModelName, OIDCModelPayload, OIDCGrantModelNames } from "../model";
import { OIDC_RDBMS_Model } from "./model";

const {STRING, JSON, DATE} = DataTypes;

export type OIDC_RDBMS_AdapterOptions = RDBMSManagerOptions;

/* Postgres, MySQL, MariaDB, SQLite and Microsoft SQL Server supported */

// tslint:disable-next-line:class-name
export class OIDC_RDBMS_Adapter extends OIDCAdapter {
  private readonly manager: RDBMSManager;

  constructor(protected readonly props: OIDCAdapterProps, options?: OIDC_RDBMS_AdapterOptions) {
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

  protected createModel<T extends OIDCModelPayload = OIDCModelPayload>(name: OIDCModelName): OIDC_RDBMS_Model<T> {

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

    return new OIDC_RDBMS_Model({
      name,
      logger: this.logger,
    }, model);
  }
}

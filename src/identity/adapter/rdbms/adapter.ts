import path from "path";
import { FindOptions, Sequelize, Op, WhereAttributeHash, RDBMSManager, RDBMSManagerOptions, Transaction } from "../../../helper/rdbms";
import { IDPAdapter, IDPAdapterProps } from "../adapter";
import { IdentityMetadata } from "../../metadata";
import { Identity } from "../../identity";
import { IdentityClaimsSchema } from "../../claims";
import * as _ from "lodash";
import { OIDCAccountClaims, OIDCAccountClaimsFilter, OIDCAccountCredentials } from "../../../oidc";
import { defineAdapterModels } from "./model";
import bcrypt from "bcrypt";
import DataLoader from "dataloader";

export type IDP_RDBMS_AdapterOptions = RDBMSManagerOptions;

/* Postgres, MySQL, MariaDB, SQLite and Microsoft SQL Server supported */

// tslint:disable-next-line:class-name
export class IDP_RDBMS_Adapter extends IDPAdapter {
  private readonly manager: RDBMSManager;
  public readonly displayName = "RDBMS";

  constructor(protected readonly props: IDPAdapterProps, options?: IDP_RDBMS_AdapterOptions) {
    super(props);

    // create manager
    this.manager = new RDBMSManager({
      logger: props.logger,
      migrationDirPath: path.join(__dirname, "./migrations"),
      migrationTableName: "idpMigrations",
    }, options);
  }

  /* define and migrate model schema */
  public async start(): Promise<void> {
    // await this.manager.rollback({ to: 0 }); // uncomment this line to develop migrations scripts
    await this.manager.migrate();

    // define models
    await defineAdapterModels(this.manager);
    await super.start();
  }

  public async stop() {
    await this.manager.dispose();
    await super.stop();
  }

  /* fetch from synced cache */
  public get IdentityCache() {
    return this.manager.getModel("IdentityCache")!;
  }

  // args will be like { claims:{}, metadata:{}, ... }
  public async find(args: WhereAttributeHash): Promise<Identity | void> {
    return this.IdentityCache.findOne({where: args, attributes: ["id"]})
      .then(raw => {
        if (!raw) return;
        return new Identity({
          id: raw.get("id") as string,
          adapter: this,
        });
      });
  }

  // args will be like { claims:{}, metadata:{}, ... }
  public async count(args: WhereAttributeHash): Promise<number> {
    return this.IdentityCache.count({where: args});
  }

  // args will be like { where: { claims:{}, metadata:{}, ...}, offset: 0, limit: 100, ... }
  public async get(args: FindOptions): Promise<Identity[]> {
    args.attributes = ["id"];
    return this.IdentityCache.findAll(args)
      .then(raws =>
        raws.map(raw => {
          return new Identity({
            id: raw.get("id") as string,
            adapter: this,
          });
        }),
      );
  }

  /* delete */
  public async delete(identity: Identity): Promise<boolean> {
    const where: WhereAttributeHash = {id: identity.id};
    let count = await this.IdentityMetadata.destroy({where});
    count += await this.IdentityClaims.destroy({where});
    count += await this.IdentityClaimsCache.destroy({where});
    count += await this.IdentityCredentials.destroy({where});
    return count > 0;
  }

  /* metadata */
  public get IdentityMetadata() {
    return this.manager.getModel("IdentityMetadata")!;
  }

  public async createOrUpdateMetadata(identity: Identity, metadata: Partial<IdentityMetadata>): Promise<void> {
    const [model, created] = await this.IdentityMetadata.findOrCreate({
      where: {id: identity.id},
      defaults: {data: metadata},
    });
    if (!created) {
      await model.update({
        data: _.defaultsDeep(metadata, (model.get({plain: true}) as any).data as IdentityMetadata || {}),
      });
    }
  }

  public async getMetadata(identity: Identity): Promise<IdentityMetadata | void> {
    return this.IdentityMetadata.findOne({where: {id: identity.id}})
      .then(raw => raw ? raw.get("data") as IdentityMetadata : undefined);
  }

  /* claims */
  public get IdentityClaims() {
    return this.manager.getModel("IdentityClaims")!;
  }

  public async createOrUpdateVersionedClaims(identity: Identity, claims: Array<{ key: string; value: any; schemaVersion: string }>): Promise<void> {
    await this.IdentityClaims.bulkCreate(
      claims.map(({key, value, schemaVersion}) => ({id: identity.id, key, schemaVersion, value})),
      {
        fields: ["id", "key", "schemaVersion", "value"],
        updateOnDuplicate: ["value"],
      },
    );
  }

  private readonly getVersionedClaimsLoader = new DataLoader<{ identity: Identity, claims: Array<{ key: string; schemaVersion?: string }> }, Partial<OIDCAccountClaims>>(
    async (entries) => {
      const where: WhereAttributeHash = {
        id: entries.map(entry => entry.identity.id),
        key: [...new Set(entries.reduce((keys, entry) => keys.concat(entry.claims.map(c => c.key)), [] as string[]))],
      };
      const foundClaimsList: Array<Partial<OIDCAccountClaims>> = new Array(entries.length).fill(null).map(() => ({}));
      const raws = await this.IdentityClaims.findAll({where});
      for (const raw of raws) {
        const claim = raw.get({plain: true}) as { id: string, key: string, value: string, schemaVersion: string };
        const entryIndex = entries.findIndex(e => e.identity.id === claim.id);
        const entry = entries[entryIndex];
        const foundClaims = foundClaimsList[entryIndex];
        const specificVersion = entry.claims.find(c => c.key === claim.key)!.schemaVersion;
        if (typeof specificVersion === "undefined" || specificVersion === claim.schemaVersion) {
          foundClaims[claim.key] = claim.value;
        }
      }
      return foundClaimsList;
    },
    {
      cache: false,
      maxBatchSize: 100,
    },
  );

  public async getVersionedClaims(identity: Identity, claims: Array<{ key: string; schemaVersion?: string }>): Promise<Partial<OIDCAccountClaims>> {
    return this.getVersionedClaimsLoader.load({identity, claims});
    // const where: WhereAttributeHash = {
    //   id: identity.id,
    //   key: claims.map(c => c.key),
    // };
    //
    // const foundClaims: Partial<OIDCAccountClaims> = {};
    // await this.IdentityClaims.findAll({where})
    //   .then(raws => {
    //     raws.forEach(raw => {
    //       const claim = raw.get({plain: true}) as { key: string, value: string, schemaVersion: string };
    //       const specificVersion = claims.find(c => c.key === claim.key)!.schemaVersion;
    //       if (typeof specificVersion === "undefined" || specificVersion === claim.schemaVersion) {
    //         foundClaims[claim.key] = claim.value;
    //       }
    //     });
    //   });
    //
    // return foundClaims;
  }

  /* cache */
  public get IdentityClaimsCache() {
    return this.manager.getModel("IdentityClaimsCache")!;
  }

  public async onClaimsUpdated(identity: Identity): Promise<void> {
    const claims = await identity.claims();
    // this.logger.info("sync indentity claims cache:", claims);
    await this.IdentityClaimsCache.upsert({
      id: identity.id,
      data: claims,
    });
  }

  /* credentials */
  public get IdentityCredentials() {
    return this.manager.getModel("IdentityCredentials")!;
  }

  public async createOrUpdateCredentials(identity: Identity, credentials: Partial<OIDCAccountCredentials>): Promise<boolean> {
    const hashedCredentials: Partial<OIDCAccountCredentials> = {};
    // hash credentials
    if (credentials.password) {
      hashedCredentials.password = await bcrypt.hash(credentials.password, 10);
    }

    const [model, created] = await this.IdentityCredentials.findOrCreate({
      where: {id: identity.id},
      defaults: hashedCredentials,
    });

    if (!created) {
      // not changed
      if (await this.assertCredentials(identity, credentials)) return false;
      await model.update(hashedCredentials);
    }
    return true;
  }

  public async assertCredentials(identity: Identity, credentials: Partial<OIDCAccountCredentials>): Promise<boolean> {
    const model = await this.IdentityCredentials.findOne({where: {id: identity.id}});
    if (!model) {
      return false;
    }

    const hashedCredentials = model.get({plain: true}) as OIDCAccountCredentials;
    if (credentials.password) {
      return bcrypt.compare(credentials.password, hashedCredentials.password);
    }

    this.logger.error(`unimplemented credentials type: ${Object.keys(credentials)}`);
    return false;
  }

  /* claims schema */
  public get IdentityClaimsSchema() {
    return this.manager.getModel("IdentityClaimsSchema")!;
  }

  public async createClaimsSchema(schema: IdentityClaimsSchema): Promise<void> {
    await this.IdentityClaimsSchema.upsert(schema);
  }

  public async forceDeleteClaimsSchema(key: string): Promise<void> {
    await this.IdentityClaimsSchema.destroy({where: {key}});
  }

  public async getClaimsSchema(args: { key: string; version?: string; active?: boolean }): Promise<IdentityClaimsSchema | void> {
    const {key, version, active} = args;
    const where: WhereAttributeHash = {key};

    if (typeof version !== "undefined") {
      where.version = version;
    }
    if (typeof active !== "undefined") {
      where.active = active;
    }

    return this.IdentityClaimsSchema
      .findOne({where})
      .then(raw => raw ? raw.get({plain: true}) as IdentityClaimsSchema : undefined);
  }

  public async setActiveClaimsSchema(args: { key: string; version: string }): Promise<void> {
    const {key, version} = args;
    await this.IdentityClaimsSchema.update({active: Sequelize.literal(`version = '${version}'`)}, {where: {key}, fields: ["active"]});
  }

  public async getClaimsSchemata(args: { scope: string[], key?: string, version?: string, active?: boolean }): Promise<IdentityClaimsSchema[]> {
    const {scope, key, version, active} = args;
    const where: WhereAttributeHash = {};

    if (scope.length !== 0) {
      where.scope = scope;
    }
    if (typeof key !== "undefined") {
      where.key = key;
    }
    if (typeof version !== "undefined") {
      where.version = version;
    }
    if (typeof active !== "undefined") {
      where.active = active;
    }

    return this.IdentityClaimsSchema
      .findAll({where})
      .then(raws => raws.map(raw => raw.get({plain: true}) as IdentityClaimsSchema));
  }

  /* transaction and migration lock for distributed system */
  public async transaction(): Promise<Transaction> {
    return this.manager.sequelize.transaction({
      autocommit: false,
      type: Transaction.TYPES.DEFERRED,
      isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
    });
  }

  public get IdentityClaimsMigrationLock() {
    return this.manager.getModel("IdentityClaimsMigrationLock")!;
  }

  public async acquireMigrationLock(key: string): Promise<void> {
    const [lock, created] = await this.IdentityClaimsMigrationLock.findOrCreate({where: {key}});

    // old lock found
    if (!created) {
      this.logger.info(`retry to acquire migration lock after 5s: ${key}`);
      await new Promise(resolve => setTimeout(resolve, 5 * 1000));
      return this.acquireMigrationLock(key);
    }
  }

  public async releaseMigrationLock(key: string): Promise<void> {
    await this.IdentityClaimsMigrationLock.destroy({where: {key}});
  }
}

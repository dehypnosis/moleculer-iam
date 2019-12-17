import * as _ from "lodash";
import { IDPAdapter, IDPAdapterProps } from "../adapter";
import { OIDCAccountClaims, OIDCAccountCredentials } from "../../../oidc";
import { IdentityMetadata } from "../../metadata";
import { IdentityClaimsSchema } from "../../claims";
import { Identity } from "../../identity";
import { FindOptions } from "../../../helper/rdbms";
import { Errors } from "../../error";

export type IDP_MemoryAdapterOptions = {};

// tslint:disable-next-line:class-name
export class IDP_MemoryAdapter extends IDPAdapter {
  public readonly displayName = "Memory";

  constructor(protected readonly props: IDPAdapterProps, options?: IDP_MemoryAdapterOptions) {
    super(props);
  }

  /* fetch */
  public async find(args: { id?: string, email?: string, phone_number?: string }, metadata: Partial<IdentityMetadata>): Promise<Identity | void> {
    // find identity by id, email, phone
    let foundId: string = "";
    if (args.id) {
      const schema = await this.getClaimsSchema({key: "sub", active: true}) as IdentityClaimsSchema;
      for (const [id, claims] of this.identityClaimsMap.entries()) {
        if (claims.some(c => c.key === "sub" && c.value === args.id && c.schemaVersion === schema.version)) {
          foundId = id;
          break;
        }
      }
    } else if (args.email) {
      const schema = await this.getClaimsSchema({key: "email", active: true}) as IdentityClaimsSchema;
      for (const [id, claims] of this.identityClaimsMap.entries()) {
        if (claims.some(c => c.key === "email" && c.value === args.email && c.schemaVersion === schema.version)) {
          foundId = id;
          break;
        }
      }
    } else if (args.phone_number) {
      const schema = await this.getClaimsSchema({key: "phone_number", active: true}) as IdentityClaimsSchema;
      for (const [id, claims] of this.identityClaimsMap.entries()) {
        if (claims.some(c => c.key === "phone_number" && c.value === args.phone_number && c.schemaVersion === schema.version)) {
          foundId = id;
          break;
        }
      }
    }

    if (foundId) {
      const identity = new Identity({
        id: foundId,
        adapter: this,
      });

      // filter by metadata
      if (typeof metadata.softDeleted !== "undefined") {
        const identityMetadata = await identity.metadata();
        if (identityMetadata.softDeleted !== metadata.softDeleted) {
          return;
        }
      }

      return identity;
    }
  }

  // only support offset, limit
  public async get(args: FindOptions, metadata: Partial<IdentityMetadata>): Promise<Identity[]> {
    const identities = [...this.identityMetadataMap.keys()]
      .map(id => new Identity({id, adapter: this}));

    return identities
      .slice(
        args.offset || 0,
        typeof args.limit === "undefined" ? identities.length : args.limit,
      );
  }

  public async count(args: Omit<FindOptions, "limit" | "offset">, metadata: Partial<IdentityMetadata>): Promise<number> {
    return this.identityMetadataMap.size;
  }

  /* create */
  public async prepareToCreate(identity: Identity): Promise<void> {
    this.identityClaimsMap.set(identity.id, []);
  }

  /* delete */
  public async delete(identity: Identity): Promise<boolean> {
    if (!this.identityMetadataMap.has(identity.id)) return false;

    this.identityMetadataMap.delete(identity.id);
    this.identityClaimsMap.delete(identity.id);
    this.identityCredentialsMap.delete(identity.id);
    return true;
  }

  /* metadata */
  private readonly identityMetadataMap = new Map<string, IdentityMetadata>();

  public async updateMetadata(identity: Identity, metadata: Partial<IdentityMetadata>): Promise<void> {
    const old = this.identityMetadataMap.get(identity.id);
    this.identityMetadataMap.set(identity.id, _.defaultsDeep(metadata, old || {}) as IdentityMetadata);
  }

  public async metadata(identity: Identity): Promise<IdentityMetadata> {
    return this.identityMetadataMap.get(identity.id)!;
  }

  /* claims cache */
  private readonly claimsCacheMap = new Map<string, Map<string, OIDCAccountClaims>>();

  public async setClaimsCache(identity: Identity, cacheKey: string, claims: OIDCAccountClaims): Promise<void> {
    let cache = this.claimsCacheMap.get(identity.id);
    if (!cache) {
      cache = new Map<string, OIDCAccountClaims>();
      this.claimsCacheMap.set(identity.id, cache);
    }
    cache.set(cacheKey, claims);
  }

  public async getClaimsCache(identity: Identity, cacheKey: string): Promise<OIDCAccountClaims | void> {
    let cache = this.claimsCacheMap.get(identity.id);
    if (!cache) {
      cache = new Map<string, OIDCAccountClaims>();
      this.claimsCacheMap.set(identity.id, cache);
      return;
    }
    return cache.get(cacheKey);
  }

  public async clearClaimsCache(identity?: Identity): Promise<void> {
    if (identity) {
      this.claimsCacheMap.delete(identity.id);
    } else {
      this.claimsCacheMap.clear();
    }
  }

  /* claims */
  private readonly identityClaimsMap = new Map<string, Array<{ key: string; value: any; schemaVersion: string }>>();

  public async putClaimsVersion(identity: Identity, claims: Array<{ key: string; value: any; schemaVersion: string }>, migrationKey?: string): Promise<void> {

    const job = async () => {
      const oldClaims = this.identityClaimsMap.get(identity.id)!;
      for (const claim of claims) {
        const oldClaim = oldClaims.find(c => c.key === claim.key && c.schemaVersion === claim.schemaVersion);
        if (oldClaim) {
          oldClaim.value = claim.value;
        } else {
          oldClaims.push(claim);
        }
      }
    };

    if (migrationKey) {
      this.migrationJobsMap.get(migrationKey)!.push(job);
    } else {
      await job();
    }
  }

  public async getClaimsVersion(identity: Identity, claims: Array<{ key: string; schemaVersion?: string }>): Promise<Partial<OIDCAccountClaims>> {
    const foundClaims: Partial<OIDCAccountClaims> = {};
    const storedClaims = this.identityClaimsMap.get(identity.id)!;
    for (const {key, schemaVersion} of claims) {
      const foundClaim = storedClaims.find(claim => {
        if (key !== claim.key) return false;
        if (typeof schemaVersion !== "undefined" && schemaVersion !== claim.schemaVersion) return false;
        return true;
      });
      if (foundClaim) foundClaims[key] = foundClaim.value;
    }
    return foundClaims;
  }

  /* credentials */
  private readonly identityCredentialsMap = new Map<string, Partial<OIDCAccountCredentials>>();

  public async updateCredentials(identity: Identity, credentials: Partial<OIDCAccountCredentials>): Promise<boolean> {
    const cred = this.identityCredentialsMap.get(identity.id);
    if (cred && JSON.stringify(cred) === JSON.stringify(credentials)) return false;

    this.identityCredentialsMap.set(identity.id, {...cred, ...credentials});
    return true;
  }

  public async assertCredentials(identity: Identity, credentials: Partial<OIDCAccountCredentials>): Promise<boolean> {
    const cred = this.identityCredentialsMap.get(identity.id);
    if (!cred) return false;

    for (const [type, value] of Object.entries(credentials)) {
      if (cred[type as keyof OIDCAccountCredentials] !== value) return false;
    }
    return true;
  }

  /* claims schema */
  private readonly schemata = new Array<IdentityClaimsSchema>();

  public async putClaimsSchema(schema: IdentityClaimsSchema, migrationKey?: string): Promise<void> {
    const job = async () => {
      this.schemata.push(schema);
    };

    if (migrationKey) {
      this.migrationJobsMap.get(migrationKey)!.push(job);
    } else {
      await job();
    }
  }

  public async getClaimsSchema(args: { key: string; version?: string; active?: boolean }): Promise<IdentityClaimsSchema | void> {
    const {key, version, active} = args;
    return this.schemata.find(sch => {
      if (key !== sch.key) return false;
      if (typeof version !== "undefined" && version !== sch.version) return false;
      if (typeof active !== "undefined" && active !== sch.active) return false;
      return true;
    });
  }

  public async setActiveClaimsSchema(args: { key: string; version: string }, migrationKey?: string): Promise<void> {
    const {key, version} = args;
    const job = async () => {
      this.schemata.forEach(sch => {
        if (key !== sch.key) return;
        sch.active = version === sch.version;
      });
    };

    if (migrationKey) {
      this.migrationJobsMap.get(migrationKey)!.push(job);
    } else {
      await job();
    }
  }

  public async getClaimsSchemata(args: { scope: string[], key?: string, version?: string, active?: boolean }): Promise<IdentityClaimsSchema[]> {
    const {scope, key, version, active} = args;
    return this.schemata.filter(schema => {
      if (scope.length !== 0 && !scope.includes(schema.scope)) return false;
      if (typeof key !== "undefined" && key !== schema.key) return false;
      if (typeof version !== "undefined" && version !== schema.version) return false;
      if (typeof active !== "undefined" && active !== schema.active) return false;
      return true;
    });
  }

  /* transaction for migration */
  private readonly migrationJobsMap = new Map<string, Array<() => Promise<void>>>();

  public async beginMigration(key: string): Promise<void> {
    const jobs = this.migrationJobsMap.get(key);
    if (jobs) {
      throw new Errors.MigrationError("Migration is already being processed.");
    }
    this.migrationJobsMap.set(key, []);
  }

  public async commitMigration(key: string): Promise<void> {
    const jobs = this.migrationJobsMap.get(key);
    if (!jobs) {
      throw new Errors.MigrationError("There are no queued migration jobs to commit.");
    }
    await Promise.all(jobs.map(job => job()));
    this.migrationJobsMap.delete(key);
  }

  public async rollbackMigration(key: string): Promise<void> {
    const jobs = this.migrationJobsMap.get(key);
    if (!jobs) {
      throw new Errors.MigrationError("There are no queued migration jobs to rollback.");
    }
    this.migrationJobsMap.delete(key);
  }

  private readonly migrationLocksMap = new Map<string, boolean>();

  public async acquireMigrationLock(key: string): Promise<void> {
    if (this.migrationLocksMap.get(key)) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return this.acquireMigrationLock(key);
    }

    this.migrationLocksMap.set(key, true);
  }

  public async releaseMigrationLock(key: string): Promise<void> {
    this.migrationLocksMap.delete(key);
    this.migrationJobsMap.delete(key);
  }
}

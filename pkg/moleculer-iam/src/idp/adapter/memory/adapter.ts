import * as _ from "lodash";
import { IDPAdapter, IDPAdapterProps, Transaction } from "../adapter";
import { OIDCAccountClaims, OIDCAccountCredentials } from "../../../op";
import { IdentityMetadata } from "../../metadata";
import { IdentityClaimsSchema } from "../../claims";
import { FindOptions, WhereAttributeHash } from "../../../lib/rdbms";

export type IDP_MemoryAdapterOptions = {};

// tslint:disable-next-line:class-name
export class IDP_MemoryAdapter extends IDPAdapter {
  public readonly displayName = "Memory";

  constructor(protected readonly props: IDPAdapterProps, options?: IDP_MemoryAdapterOptions) {
    super(props);
  }

  /* fetch */

  // support only identity by id (sub), email, phone
  public async find(args: WhereAttributeHash): Promise<string | void> {
    let foundId: string = "";
    const argsId = args.id || args.claims && (args.claims as any).sub;
    if (argsId) {
      const schema = await this.getClaimsSchema({key: "sub", active: true}) as IdentityClaimsSchema;
      for (const [id, claims] of this.identityClaimsMap.entries()) {
        if (claims.some(c => c.key === "sub" && c.value === argsId && c.schemaVersion === schema.version)) {
          foundId = id;
          break;
        }
      }
    } else if (args.claims && (args.claims as any).email) {
      const schema = await this.getClaimsSchema({key: "email", active: true}) as IdentityClaimsSchema;
      for (const [id, claims] of this.identityClaimsMap.entries()) {
        if (claims.some(c => c.key === "email" && c.value === (args.claims as any).email && c.schemaVersion === schema.version)) {
          foundId = id;
          break;
        }
      }
    } else if (args.claims && (args.claims as any).phone_number) {
      const schema = await this.getClaimsSchema({key: "phone_number", active: true}) as IdentityClaimsSchema;
      for (const [id, claims] of this.identityClaimsMap.entries()) {
        if (claims.some(c => c.key === "phone_number" && c.value === (args.claims as any).phone_number && c.schemaVersion === schema.version)) {
          foundId = id;
          break;
        }
      }
    }

    if (foundId) {
      // filter by metadata for the common test
      if (args.metadata && !(await this.filerMetadata([foundId], args.metadata)).includes(foundId)) {
        return;
      }
      return foundId;
    }
  }

  // filter by metadata poorly for the common test
  private async filerMetadata(ids: string[], condition: any): Promise<string[]> {
    if (Object.keys(condition).length === 0) return ids;

    const filteredIds: string[] = [];

    for (const id of ids) {
      const metadata = await this.getMetadata(id);
      if (metadata &&  _.isMatch(metadata, condition)) {
        filteredIds.push(id);
      }
    }
    return filteredIds;
  }

  // only support offset, limit, metadata
  public async get(args: FindOptions): Promise<string[]> {
    let ids = [...this.identityMetadataMap.keys()];

    // filter by metadata for the common test
    if (args.where && (args.where as any).metadata) {
      ids = await this.filerMetadata(ids, (args.where as any).metadata);
    }

    return ids
      .slice(
        args.offset || 0,
        typeof args.limit === "undefined" ? ids.length : args.limit,
      );
  }

  public async count(args: WhereAttributeHash): Promise<number> {
    return (await this.get(args)).length;
  }

  /* delete */
  public async delete(id: string): Promise<boolean> {
    if (!this.identityMetadataMap.has(id)) return false;

    this.identityMetadataMap.delete(id);
    this.identityClaimsMap.delete(id);
    this.identityCredentialsMap.delete(id);
    return true;
  }

  /* metadata */
  private readonly identityMetadataMap = new Map<string, IdentityMetadata>();

  public async createOrUpdateMetadata(id: string, metadata: Partial<IdentityMetadata>, transaction?: Transaction): Promise<void> {
    const old = this.identityMetadataMap.get(id);
    this.identityMetadataMap.set(id, _.defaultsDeep(metadata, old || {}) as IdentityMetadata);
  }

  public async getMetadata(id: string): Promise<IdentityMetadata | void> {
    return this.identityMetadataMap.get(id);
  }

  /* claims */
  private readonly identityClaimsMap = new Map<string, { key: string; value: any; schemaVersion: string }[]>();

  public async createOrUpdateVersionedClaims(id: string, claims: { key: string; value: any; schemaVersion: string }[]): Promise<void> {
    let oldClaims = this.identityClaimsMap.get(id);
    if (!oldClaims) {
      oldClaims = [];
      this.identityClaimsMap.set(id, oldClaims);
    }
    for (const claim of claims) {
      const oldClaim = oldClaims.find(c => c.key === claim.key && c.schemaVersion === claim.schemaVersion);
      if (oldClaim) {
        oldClaim.value = claim.value;
      } else {
        oldClaims.push(claim);
      }
    }
  }

  public async onClaimsUpdated(id: string, updatedClaims: Partial<OIDCAccountClaims>, transaction?: Transaction): Promise<void> {
    // ...
  }

  public async getVersionedClaims(id: string, claims: { key: string; schemaVersion?: string }[]): Promise<Partial<OIDCAccountClaims>> {
    const foundClaims: Partial<OIDCAccountClaims> = {};
    const storedClaims = this.identityClaimsMap.get(id) || [];
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

  public async createOrUpdateCredentials(id: string, credentials: Partial<OIDCAccountCredentials>, transaction?: Transaction): Promise<boolean> {
    const cred = this.identityCredentialsMap.get(id);
    if (cred && JSON.stringify(cred) === JSON.stringify(credentials)) return false;

    this.identityCredentialsMap.set(id, {...cred, ...credentials});
    return true;
  }

  public async assertCredentials(id: string, credentials: Partial<OIDCAccountCredentials>): Promise<boolean|null> {
    const cred = this.identityCredentialsMap.get(id);
    if (typeof cred === "undefined") return null;

    for (const [type, value] of Object.entries(credentials)) {
      const answer = cred[type as keyof OIDCAccountCredentials];
      if (typeof answer === "undefined") return null;
      if (answer !== value) return false;
    }
    return true;
  }

  /* claims schema */
  private schemata = new Array<IdentityClaimsSchema>();

  public async createClaimsSchema(schema: IdentityClaimsSchema, transaction?: Transaction): Promise<void> {
    this.schemata.push(schema);
  }

  public async forceDeleteClaimsSchema(key: string): Promise<void> {
    this.schemata = this.schemata.filter(schema => schema.key !== key);
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

  public async setActiveClaimsSchema(args: { key: string; version: string }, transaction?: Transaction): Promise<void> {
    const {key, version} = args;
    this.schemata.forEach(sch => {
      if (key !== sch.key) return;
      sch.active = version === sch.version;
    });
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

  /* transaction and migration lock for distributed system */
  public async transaction(): Promise<Transaction> {
    const logger = this.logger;
    return {
      async commit(): Promise<void> {
        logger.warn("Memory adapter has not implemented transaction: commit()");
      },
      async rollback(): Promise<void> {
        logger.warn("Memory adapter has not implemented transaction: commit()");
      },
    };
  }

  private readonly migrationLocksMap = new Map<string, boolean>();

  public async acquireMigrationLock(key: string): Promise<void> {
    if (this.migrationLocksMap.size > 0) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return this.acquireMigrationLock(key);
    }

    this.migrationLocksMap.set(key, true);
  }

  public async touchMigrationLock(key: string, migratedIdentitiesNumber: number): Promise<void> {
    // ...
    this.logger.warn("Memory adapter has not implemented dead lock resolving strategy, migration is working for: ", key, migratedIdentitiesNumber);
  }

  public async releaseMigrationLock(key: string): Promise<void> {
    this.migrationLocksMap.delete(key);
  }
}

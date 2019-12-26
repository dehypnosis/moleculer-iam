import * as _ from "lodash";
import { IDPAdapter, IDPAdapterProps, Transaction } from "../adapter";
import { OIDCAccountClaims, OIDCAccountCredentials } from "../../../oidc";
import { IdentityMetadata } from "../../metadata";
import { IdentityClaimsSchema } from "../../claims";
import { Identity } from "../../identity";
import { FindOptions, WhereAttributeHash } from "../../../helper/rdbms";

export type IDP_MemoryAdapterOptions = {};

// tslint:disable-next-line:class-name
export class IDP_MemoryAdapter extends IDPAdapter {
  public readonly displayName = "Memory";

  constructor(protected readonly props: IDPAdapterProps, options?: IDP_MemoryAdapterOptions) {
    super(props);
  }

  /* fetch */
  // support only identity by id (sub), email, phone
  public async find(args: WhereAttributeHash): Promise<Identity | void> {
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
      const identity = new Identity({
        id: foundId,
        adapter: this,
      });

      // filter by metadata
      if (args.metadata && typeof (args.metadata as any).softDeleted !== "undefined") {
        const identityMetadata = await identity.metadata();
        if (identityMetadata.softDeleted !== (args.metadata as any).softDeleted) {
          return;
        }
      }

      return identity;
    }
  }

  // only support offset, limit
  public async get(args: FindOptions): Promise<Identity[]> {
    const identities = [...this.identityMetadataMap.keys()]
      .map(id => new Identity({id, adapter: this}));

    return identities
      .slice(
        args.offset || 0,
        typeof args.limit === "undefined" ? identities.length : args.limit,
      );
  }

  public async count(args: WhereAttributeHash): Promise<number> {
    return (await this.get(args)).length;
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

  public async createOrUpdateMetadata(identity: Identity, metadata: Partial<IdentityMetadata>, transaction?: Transaction): Promise<void> {
    const old = this.identityMetadataMap.get(identity.id);
    this.identityMetadataMap.set(identity.id, _.defaultsDeep(metadata, old || {}) as IdentityMetadata);
  }

  public async getMetadata(identity: Identity): Promise<IdentityMetadata | void> {
    return this.identityMetadataMap.get(identity.id);
  }

  /* claims */
  private readonly identityClaimsMap = new Map<string, Array<{ key: string; value: any; schemaVersion: string }>>();

  public async createOrUpdateVersionedClaims(identity: Identity, claims: Array<{ key: string; value: any; schemaVersion: string }>): Promise<void> {
    let oldClaims = this.identityClaimsMap.get(identity.id);
    if (!oldClaims) {
      oldClaims = [];
      this.identityClaimsMap.set(identity.id, oldClaims);
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

  public async onClaimsUpdated(identity: Identity, transaction?: Transaction): Promise<void> {
    // ...
  }

  public async getVersionedClaims(identity: Identity, claims: Array<{ key: string; schemaVersion?: string }>): Promise<Partial<OIDCAccountClaims>> {
    const foundClaims: Partial<OIDCAccountClaims> = {};
    const storedClaims = this.identityClaimsMap.get(identity.id) || [];
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

  public async createOrUpdateCredentials(identity: Identity, credentials: Partial<OIDCAccountCredentials>, transaction?: Transaction): Promise<boolean> {
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
    if (this.migrationLocksMap.get(key)) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return this.acquireMigrationLock(key);
    }

    this.migrationLocksMap.set(key, true);
  }

  public async releaseMigrationLock(key: string): Promise<void> {
    this.migrationLocksMap.delete(key);
  }
}

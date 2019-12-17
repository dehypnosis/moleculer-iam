import * as _ from "lodash";
import kleur from "kleur";
import hashObject from "object-hash";
import { Logger } from "../../logger";
import { FindOptions } from "../../helper/rdbms";
import { OIDCAccountClaims, OIDCAccountClaimsFilter, OIDCAccountCredentials, OIDCClaimsInfo } from "../../oidc";
import { Identity } from "../identity";
import { IdentityMetadata } from "../metadata";
import { IdentityClaimsSchema } from "../claims";
import { ValidationSchema, validator  } from "../../validator";
import { Errors } from "../error";

export type IDPAdapterProps = {
  logger?: Logger,
};

export abstract class IDPAdapter {
  protected readonly logger: Logger;
  public readonly abstract displayName: string;

  constructor(protected readonly props: IDPAdapterProps, options?: any) {
    this.logger = props.logger || console;
  }

  /* Lifecycle methods: do sort of DBMS schema migration and making connection */
  public async start(): Promise<void> {
    this.logger.info(`${kleur.blue(this.displayName)} identity provider adapter has been started`);
  }

  public async stop(): Promise<void> {
    this.logger.info(`${kleur.blue(this.displayName)} identity provider adapter has been stopped`);
  }

  /* CRD identity */
  public abstract async find(args: { id?: string, email?: string, phone_number?: string }, metadata: Partial<IdentityMetadata>): Promise<Identity | void>;

  public abstract async get(args: FindOptions, metadata: Partial<IdentityMetadata>): Promise<Identity[]>;

  public abstract async count(args: Omit<FindOptions, "limit" | "offset">, metadata: Partial<IdentityMetadata>): Promise<number>;

  public abstract async prepareToCreate(identity: Identity): Promise<void>;

  public async create(args: { metadata: IdentityMetadata, scope: string[], claims: OIDCAccountClaims, credentials: Partial<OIDCAccountCredentials> }): Promise<Identity> {
    const {metadata, claims, credentials} = args;
    if (await this.find({id: claims.sub}, {softDeleted: undefined})) {
      throw new Errors.IdentityAlreadyExistsError();
    }

    // check openid scope sub field is defined
    if (!claims.sub) {
      throw new Errors.ValidationError([{
        type: "required",
        field: "sub",
        message: "The 'sub' field is required.",
        actual: claims.sub,
      }]);
    }

    // create empty identity
    const identity = new Identity({
      id: claims.sub,
      adapter: this,
    });

    // save metadata, claims, credentials
    try {
      await this.prepareToCreate(identity);
      await this.updateMetadata(identity, metadata);
      await this.updateClaims(identity, claims, {scope: args.scope});
      await this.updateCredentials(identity, credentials);
    } catch (err) {
      await identity.delete(false);
      throw err;
    }

    return identity;
  }

  public abstract async delete(identity: Identity): Promise<boolean>;

  /* fetch claims cache and create claims entities (versioned, immutable) */
  protected getClaimsCacheFilterKey(filter: OIDCAccountClaimsFilter) {
    return hashObject(filter, {
      algorithm: "md5",
      unorderedArrays: true,
      unorderedObjects: true,
      unorderedSets: true,
    });
  }

  public async claims(identity: Identity, filter: OIDCAccountClaimsFilter): Promise<OIDCAccountClaims> {
    // check cache
    const cacheFilterKey = this.getClaimsCacheFilterKey(filter);
    if (this.getClaimsCache) {
      const cachedClaims = await this.getClaimsCache(identity, cacheFilterKey);
      if (cachedClaims) {
        return cachedClaims;
      }
    }

    // get active claims
    const claimsSchemata = await this.getClaimsSchemata({scope: filter.scope, active: true});
    const claims = await this.getClaimsVersion(
      identity,
      claimsSchemata.map(schema => ({
        key: schema.key,
        schemaVersion: schema.version,
      })),
    ) as OIDCAccountClaims;
    for (const schema of claimsSchemata) {
      if (typeof claims[schema.key] === "undefined") {
        claims[schema.key] = null;
      }
    }

    // save cache
    if (this.setClaimsCache) {
      await this.setClaimsCache(identity, cacheFilterKey, claims);
    }

    return claims;
  }

  public async updateClaims(identity: Identity, claims: Partial<OIDCAccountClaims>, filter: Omit<OIDCAccountClaimsFilter, "use">): Promise<void> {
    // load active claims schemata
    const claimsSchemata = await this.getClaimsSchemata({scope: filter.scope, active: true});
    const claimsSchemataObject = claimsSchemata.reduce((obj, schema) => {
      obj[schema.key] = schema;
      return obj;
    }, {} as { [key: string]: IdentityClaimsSchema });

    // prepare to validate and merge old claims
    const claimsValidationSchema = claimsSchemata.reduce((obj, claimsSchema) => {
      obj[claimsSchema.key] = claimsSchema.validation;
      return obj;
    }, {
      $$strict: true,
    } as ValidationSchema);
    const oldClaims = await this.claims(identity, {...filter, use: "userinfo"});

    // prevent sub claim from being updated
    if (oldClaims.sub) {
      delete claimsValidationSchema.sub;
      delete oldClaims.sub;
    }
    const validate = validator.compile(claimsValidationSchema);

    // merge old claims
    const mergedClaims = _.defaultsDeep(claims, oldClaims);
    const result = validate(mergedClaims);
    if (result !== true) {
      throw new Errors.ValidationError(result, {claims, mergedClaims});
    }

    await this.putClaimsVersion(
      identity,
      Array.from(Object.entries(mergedClaims))
        .map(([key, value]) => ({
          key,
          value,
          schemaVersion: claimsSchemataObject[key].version,
        })),
    );

    // clear cache
    if (this.clearClaimsCache) {
      await this.clearClaimsCache(identity);
    }
  }

  public abstract async setClaimsCache?(identity: Identity, cacheFilterKey: string, claims: OIDCAccountClaims): Promise<void>;

  public abstract async getClaimsCache?(identity: Identity, cacheFilterKey: string): Promise<OIDCAccountClaims | void>;

  public abstract async clearClaimsCache?(identity?: Identity): Promise<void>;

  public abstract async putClaimsVersion(identity: Identity, claims: Array<{ key: string, value: any, schemaVersion: string }>, migrationKey?: string): Promise<void>;

  public abstract async getClaimsVersion(identity: Identity, claims: Array<{ key: string, schemaVersion?: string }>): Promise<Partial<OIDCAccountClaims>>;

  public abstract async putClaimsSchema(schema: IdentityClaimsSchema, migrationKey?: string): Promise<void>;

  public abstract async getClaimsSchema(args: { key: string, version?: string, active?: boolean }): Promise<IdentityClaimsSchema | void>;

  // scope: [] means all scopes
  public abstract async getClaimsSchemata(args: { scope: string[], key?: string, version?: string, active?: boolean }): Promise<IdentityClaimsSchema[]>;

  public abstract async setActiveClaimsSchema(args: { key: string, version: string }, migrationKey?: string): Promise<void>;

  /* identity metadata (for federation information, soft deletion, etc. not-versioned) */
  public abstract async metadata(identity: Identity): Promise<IdentityMetadata>;

  public abstract async updateMetadata(identity: Identity, metadata: Partial<IdentityMetadata>): Promise<void>;

  /* identity credentials */
  public abstract async assertCredentials(identity: Identity, credentials: Partial<OIDCAccountCredentials>): Promise<boolean>;

  public abstract async updateCredentials(identity: Identity, credentials: Partial<OIDCAccountCredentials>): Promise<boolean>;

  /* manage claims schema */
  public abstract async beginMigration(key: string): Promise<void>;

  public abstract async commitMigration(key: string): Promise<void>;

  public abstract async rollbackMigration(key: string): Promise<void>;

  public abstract async acquireMigrationLock(key: string): Promise<void>;

  public abstract async releaseMigrationLock(key: string): Promise<void>;
}

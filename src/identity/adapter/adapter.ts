import * as _ from "lodash";
import kleur from "kleur";
import { Logger } from "../../logger";
import { FindOptions, WhereAttributeHash } from "../../helper/rdbms";
import { OIDCAccountClaims, OIDCAccountClaimsFilter, OIDCAccountCredentials } from "../../oidc";
import { Identity } from "../identity";
import { defaultIdentityMetadata, IdentityMetadata } from "../metadata";
import { IdentityClaimsSchema } from "../claims";
import { ValidationSchema, ValidationError, validator } from "../../validator";
import { Errors } from "../error";

export type IDPAdapterProps = {
  logger?: Logger,
};

export interface Transaction {
  commit(): Promise<void>;

  rollback(): Promise<void>;
}

export type IDPAdapterEvent = "claimsSchemaUpdate" | "";

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

  // args will be like { claims:{}, metadata:{}, ... }
  public abstract async find(args: WhereAttributeHash): Promise<Identity | void>;

  // args will be like { claims:{}, metadata:{}, ... }
  public abstract async count(args: WhereAttributeHash): Promise<number>;

  // args will be like { where: { claims:{}, metadata:{}, ...}, offset: 0, limit: 100, ... }
  public abstract async get(args: FindOptions): Promise<Identity[]>;

  public async create(args: { metadata: Partial<IdentityMetadata>, scope: string[], claims: OIDCAccountClaims, credentials: Partial<OIDCAccountCredentials> }): Promise<Identity> {
    const {metadata, claims, credentials} = args;
    if (await this.find({id: claims.sub})) {
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
    let transaction: Transaction;
    try {
      transaction = await this.transaction();
      await this.createOrUpdateMetadata(identity, _.defaultsDeep(metadata, defaultIdentityMetadata));
      await this.createOrUpdateClaims(identity, claims, {scope: args.scope}, false);
      await this.createOrUpdateCredentials(identity, credentials);
      await this.onClaimsUpdated(identity);
      await transaction.commit();
    } catch (err) {
      if (transaction!) {
        await transaction!.rollback();
      }
      await this.delete(identity);
      throw err;
    }

    return identity;
  }

  public abstract async delete(identity: Identity): Promise<boolean>;

  /* fetch and create claims entities (versioned, immutable) */
  public async getClaims(identity: Identity, filter: OIDCAccountClaimsFilter): Promise<OIDCAccountClaims> {
    // get active claims
    const { claimsSchemata } = await this.getCachedActiveClaimsSchemata(filter.scope);
    const claims = await this.getVersionedClaims(
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

    return claims;
  }

  protected readonly getCachedActiveClaimsSchemata = _.memoize(
    async (scope: string[], isUpdate = true) => {
      const claimsSchemata = await this.getClaimsSchemata({scope, active: true});
      const activeClaimsVersions = claimsSchemata.reduce((obj, schema) => {
        obj[schema.key] = schema.version;
        return obj;
      }, {} as { [key: string]: string });

      // prepare to validate and merge old claims
      const claimsValidationSchema = claimsSchemata.reduce((obj, claimsSchema) => {
        obj[claimsSchema.key] = claimsSchema.validation;
        return obj;
      }, {
        $$strict: true,
      } as ValidationSchema);

      // prevent sub claim from being updated
      if (isUpdate) {
        delete claimsValidationSchema.sub;
      }

      return {
        claimsSchemata,
        activeClaimsVersions,
        validateClaims: validator.compile(claimsValidationSchema),
      };
    },
    (...args: any[]) => JSON.stringify(args),
  );

  public async createOrUpdateClaims(identity: Identity, claims: Partial<OIDCAccountClaims>, filter: Omit<OIDCAccountClaimsFilter, "use">, isUpdate = true): Promise<void> {
    // load old claims and active claims schemata
    const oldClaims = await this.getClaims(identity, {...filter, use: "userinfo"});
    const {activeClaimsVersions, validateClaims} = await this.getCachedActiveClaimsSchemata(filter.scope, isUpdate);
    if (isUpdate) {
      delete oldClaims.sub;
    }

    // merge old claims and validate merged one
    const mergedClaims = _.defaultsDeep(claims, oldClaims);
    const result = validateClaims(mergedClaims);
    if (result !== true) {
      throw new Errors.ValidationError(result, {claims, mergedClaims});
    }

    await this.createOrUpdateVersionedClaims(
      identity,
      Array.from(Object.entries(mergedClaims))
        .map(([key, value]) => ({
          key,
          value,
          schemaVersion: activeClaimsVersions[key],
        })),
    );
  }

  public abstract async onClaimsUpdated(identity: Identity): Promise<void>;

  public abstract async createOrUpdateVersionedClaims(identity: Identity, claims: Array<{ key: string, value: any, schemaVersion: string }>): Promise<void>;

  public abstract async getVersionedClaims(identity: Identity, claims: Array<{ key: string, schemaVersion?: string }>): Promise<Partial<OIDCAccountClaims>>;

  public abstract async createClaimsSchema(schema: IdentityClaimsSchema): Promise<void>;

  public abstract async forceDeleteClaimsSchema(key: string): Promise<void>;

  public async onClaimsSchemaUpdated(): Promise<void> {
    this.getCachedActiveClaimsSchemata.cache.clear!();
  }

  public abstract async getClaimsSchema(args: { key: string, version?: string, active?: boolean }): Promise<IdentityClaimsSchema | void>;

  // scope: [] means all scopes
  public abstract async getClaimsSchemata(args: { scope: string[], key?: string, version?: string, active?: boolean }): Promise<IdentityClaimsSchema[]>;

  public abstract async setActiveClaimsSchema(args: { key: string, version: string }): Promise<void>;

  /* identity metadata (for federation information, soft deletion, etc. not-versioned) */
  public abstract async getMetadata(identity: Identity): Promise<IdentityMetadata | void>;

  public abstract async createOrUpdateMetadata(identity: Identity, metadata: Partial<IdentityMetadata>): Promise<void>;

  /* identity credentials */
  public abstract async assertCredentials(identity: Identity, credentials: Partial<OIDCAccountCredentials>): Promise<boolean>;

  public abstract async createOrUpdateCredentials(identity: Identity, credentials: Partial<OIDCAccountCredentials>): Promise<boolean>;

  /* transaction and migration lock for distributed system */
  public abstract async transaction(): Promise<Transaction>;

  public abstract async acquireMigrationLock(key: string): Promise<void>;

  public abstract async releaseMigrationLock(key: string): Promise<void>;
}

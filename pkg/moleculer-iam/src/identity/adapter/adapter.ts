import * as _ from "lodash";
import kleur from "kleur";
import { Logger } from "../../logger";
import { FindOptions, WhereAttributeHash } from "../../helper/rdbms";
import { OIDCAccountClaims, OIDCAccountCredentials } from "../../oidc/proxy";
import { defaultIdentityMetadata, IdentityMetadata } from "../metadata";
import { IdentityClaimsSchema } from "../claims";
import { ValidationSchema, ValidationError, validator } from "../../validator";
import { Errors } from "../error";
import uuid from "uuid";

export type IDPAdapterProps = {
  logger?: Logger,
};

export interface Transaction {
  commit(): Promise<void>;

  rollback(): Promise<void>;
}

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
  public abstract async find(args: WhereAttributeHash): Promise<string | void>;

  // args will be like { claims:{}, metadata:{}, ... }
  public abstract async count(args: WhereAttributeHash): Promise<number>;

  // args will be like { where: { claims:{}, metadata:{}, ...}, offset: 0, limit: 100, ... }
  public abstract async get(args: FindOptions): Promise<string[]>;

  public async validate(args: { id?: string, scope: string[], claims: Partial<OIDCAccountClaims>, credentials?: Partial<OIDCAccountCredentials> }): Promise<void> {
    const {validateClaims, validateClaimsImmutability, validateClaimsUniqueness} = await this.getCachedActiveClaimsSchemata(args.scope);
    const mergedResult: ValidationError[] = [];

    // validate claims
    let result = validateClaims(args.claims);
    if (result !== true) {
      mergedResult.push(...result);
    }

    // validate immutable
    if (args.id) {
      result = await validateClaimsImmutability(args.id, args.claims);
      if (result !== true) {
        mergedResult.push(...result);
      }
    }

    // validate uniqueness
    result = await validateClaimsUniqueness(args.id, args.claims);
    if (result !== true) {
      mergedResult.push(...result);
    }

    // validate credentials
    if (args.credentials && Object.keys(args.credentials).length > 0) {
      result = this.testCredentials(args.credentials);
      if (result !== true) {
        mergedResult.push(...result);
      }
    }

    if (mergedResult.length > 0) {
      throw new Errors.ValidationError(mergedResult);
    }
  }

  public async create(args: { metadata: Partial<IdentityMetadata>, scope: string[], claims: OIDCAccountClaims, credentials: Partial<OIDCAccountCredentials> }, transaction?: Transaction): Promise<string> {
    const {metadata = {}, claims = {} as OIDCAccountClaims, credentials = {}, scope = []} = args || {};

    if (claims && !claims.sub) {
      claims.sub = uuid.v4();
    }

    if (scope && scope.length !== 0 && !scope.includes("openid")) {
      scope.push("openid");
    }

    // save metadata, claims, credentials
    let isolated = false;
    if (!transaction) {
      transaction = transaction = await this.transaction();
      isolated = true;
    }
    const id = claims.sub;
    try {
      await this.createOrUpdateMetadata(id, _.defaultsDeep(metadata, defaultIdentityMetadata), transaction);
      await this.createOrUpdateClaimsWithValidation(id, claims, scope, true, transaction);
      await this.createOrUpdateCredentialsWithValidation(id, credentials, transaction);
      if (isolated) {
        await transaction.commit();
      }
    } catch (err) {
      if (isolated) {
        await transaction.rollback();
      }
      throw err;
    }

    return id;
  }

  public abstract async delete(id: string, transaction?: Transaction): Promise<boolean>;

  /* fetch and create claims entities (versioned) */
  public async getClaims(id: string, scope: string[]): Promise<OIDCAccountClaims> {
    // get active claims
    const {claimsSchemata} = await this.getCachedActiveClaimsSchemata(scope);
    const claims = await this.getVersionedClaims(
      id,
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
    async (scope: string[]) => {
      // get schemata
      const claimsSchemata = await this.getClaimsSchemata({scope, active: true});
      const activeClaimsVersions = claimsSchemata.reduce((obj, schema) => {
        obj[schema.key] = schema.version;
        return obj;
      }, {} as { [key: string]: string });
      const validClaimsKeys = claimsSchemata.map(s => s.key);

      // get unique claims schemata
      const uniqueClaimsSchemata = claimsSchemata.filter(s => s.unique);
      const uniqueClaimsSchemataKeys = uniqueClaimsSchemata.map(s => s.key);
      const validateClaimsUniqueness = async (id: string | void, object: { [key: string]: any }): Promise<true | ValidationError[]> => {
        if (uniqueClaimsSchemata.length === 0) return true;

        const errors: ValidationError[] = [];
        for (const key of uniqueClaimsSchemataKeys) {
          const value = object[key];
          const holderId = await this.find({claims: {[key]: value}});
          if (holderId && id !== holderId) {
            errors.push({
              type: "duplicate",
              field: key,
              message: `The '${key}' field value is already used by other account.`,
              actual: value,
            });
          }
        }
        return errors.length > 0 ? errors : true;
      };

      // get immutable claims schemata
      const immutableClaimsSchemata = claimsSchemata.filter(s => s.immutable);
      const immutableClaimsSchemataScope = immutableClaimsSchemata.map(s => s.scope);
      const immutableClaimsSchemataKeys = immutableClaimsSchemata.map(s => s.key);
      const validateClaimsImmutability = async (id: string, object: { [key: string]: any }): Promise<true | ValidationError[]> => {
        if (immutableClaimsSchemata.length === 0) return true;

        const errors: ValidationError[] = [];
        const oldClaims = await this.getClaims(id, immutableClaimsSchemataScope);
        for (const key of immutableClaimsSchemataKeys) {
          const oldValue = oldClaims[key];
          const newValue = object[key];
          if (typeof newValue !== "undefined" && typeof oldValue !== "undefined" && oldValue !== null && oldValue !== newValue) {
            errors.push({
              type: "immutable",
              field: key,
              message: `The '${key}' field value cannot be updated.`,
              actual: newValue,
              expected: oldValue,
            });
          }
        }
        return errors.length > 0 ? errors : true;
      };

      // prepare to validate and merge old claims
      const claimsValidationSchema = claimsSchemata.reduce((obj, claimsSchema) => {
        obj[claimsSchema.key] = claimsSchema.validation;
        return obj;
      }, {
        $$strict: true,
      } as ValidationSchema);
      const validateClaims = validator.compile(claimsValidationSchema);

      return {
        activeClaimsVersions,
        claimsSchemata,
        validateClaims,
        validClaimsKeys,
        uniqueClaimsSchemata,
        validateClaimsUniqueness,
        immutableClaimsSchemata,
        validateClaimsImmutability,
      };
    },
    (...args: any[]) => JSON.stringify(args),
  );

  public async createOrUpdateClaimsWithValidation(id: string, claims: Partial<OIDCAccountClaims>, scope: string[], creating: boolean, transaction?: Transaction, ignoreUndefinedClaims?: boolean): Promise<void> {
    const {activeClaimsVersions, claimsSchemata, validClaimsKeys} = await this.getCachedActiveClaimsSchemata(scope);

    // merge old claims and validate merged one
    const oldClaims = await this.getClaims(id, scope);
    const mergedClaims: Partial<OIDCAccountClaims> = _.defaultsDeep(claims, oldClaims);

    if (ignoreUndefinedClaims === true) {
      for (const key of Object.keys(mergedClaims)) {
        if (!validClaimsKeys.includes(key)) {
          delete mergedClaims[key];
        }
      }
    }

    try {
      await this.validate({id: creating ? undefined : id, scope, claims: mergedClaims});
    } catch (err) {
      err.error_detail = {claims, mergedClaims, scope};
      throw err;
    }

    let isolated = false;
    if (!transaction) {
      isolated = true;
      transaction = await this.transaction();
    }

    try {
      const validClaimEntries = Array.from(Object.entries(mergedClaims))
        .filter(([key]) => activeClaimsVersions[key]);

      // update claims
      await this.createOrUpdateVersionedClaims(
        id,
        validClaimEntries
          .map(([key, value]) => ({
            key,
            value,
            schemaVersion: activeClaimsVersions[key],
          })),
        transaction,
      );

      // set metadata scope
      await this.createOrUpdateMetadata(id, {
        scope: claimsSchemata.reduce((obj, s) => {
          obj[s.scope] = true;
          return obj;
        }, {} as { [k: string]: boolean }),
      }, transaction);

      // notify update for cache
      await this.onClaimsUpdated(
        id,
        validClaimEntries.reduce((obj, [key, claim]) => {
          obj[key] = claim;
          return obj;
        }, {} as Partial<OIDCAccountClaims>),
        transaction,
      );

      if (isolated) {
        await transaction.commit();
      }
    } catch (error) {
      if (isolated) {
        await transaction.rollback();
      }
      throw error;
    }
  }

  public async deleteClaims(id: string, scope: string[], transaction?: Transaction): Promise<void> {
    const {claimsSchemata} = await this.getCachedActiveClaimsSchemata(scope);

    let isolated = false;
    if (!transaction) {
      isolated = true;
      transaction = await this.transaction();
    }

    try {
      // update claims as null
      await this.createOrUpdateVersionedClaims(
        id,
        claimsSchemata
          .map(schema => ({
            key: schema.key,
            value: null,
            schemaVersion: schema.version,
          })),
        transaction,
      );

      // set metadata scope as false
      await this.createOrUpdateMetadata(id, {
        scope: scope.reduce((obj, s) => {
          obj[s] = false;
          return obj;
        }, {} as { [k: string]: boolean }),
      }, transaction);

      // notify update for cache
      await this.onClaimsUpdated(
        id,
        claimsSchemata.reduce((obj, schema) => {
          obj[schema.key] = null;
          return obj;
        }, {} as Partial<OIDCAccountClaims>),
        transaction,
      );

      if (isolated) {
        await transaction.commit();
      }
    } catch (error) {
      if (isolated) {
        await transaction.rollback();
      }
      throw error;
    }
  }

  public abstract async onClaimsUpdated(id: string, updatedClaims: Partial<OIDCAccountClaims>, transaction?: Transaction): Promise<void>;

  public abstract async createOrUpdateVersionedClaims(id: string, claims: { key: string, value: any, schemaVersion: string }[], transaction?: Transaction): Promise<void>;

  public abstract async getVersionedClaims(id: string, claims: { key: string, schemaVersion?: string }[]): Promise<Partial<OIDCAccountClaims>>;

  public abstract async createClaimsSchema(schema: IdentityClaimsSchema, transaction?: Transaction): Promise<void>;

  public abstract async forceDeleteClaimsSchema(key: string, transaction?: Transaction): Promise<void>;

  public async onClaimsSchemaUpdated(): Promise<void> {
    this.getCachedActiveClaimsSchemata.cache.clear!();
  }

  public abstract async getClaimsSchema(args: { key: string, version?: string, active?: boolean }): Promise<IdentityClaimsSchema | void>;

  // scope: [] means all scopes
  public abstract async getClaimsSchemata(args: { scope: string[], key?: string, version?: string, active?: boolean }): Promise<IdentityClaimsSchema[]>;

  public abstract async setActiveClaimsSchema(args: { key: string; version: string }, transaction?: Transaction): Promise<void>;

  /* identity metadata (for federation information, soft deletion, etc. not-versioned) */
  public abstract async getMetadata(id: string): Promise<IdentityMetadata | void>;

  public abstract async createOrUpdateMetadata(id: string, metadata: Partial<IdentityMetadata>, transaction?: Transaction): Promise<void>;

  /* identity credentials */
  public abstract async assertCredentials(id: string, credentials: Partial<OIDCAccountCredentials>): Promise<boolean>;

  protected abstract async createOrUpdateCredentials(id: string, credentials: Partial<OIDCAccountCredentials>, transaction?: Transaction): Promise<boolean>;

  private readonly testCredentials = validator.compile({
    password: {
      type: "string",
      min: 8,
      max: 32,
      optional: true,
    },
    password_confirmation: {
      type: "equal",
      field: "password",
      optional: true,
    },
  });

  public async createOrUpdateCredentialsWithValidation(id: string, credentials: Partial<OIDCAccountCredentials>, transaction?: Transaction): Promise<boolean> {
    let isolated = false;
    if (!transaction) {
      transaction = transaction = await this.transaction();
      isolated = true;
    }
    try {
      await this.validateCredentials(credentials);

      const updated = await this.createOrUpdateCredentials(id, credentials, transaction);
      await this.createOrUpdateMetadata(id, {
        credentials: Object.keys(credentials).reduce((obj, credType) => {
          obj[credType] = true;
          return obj;
        }, {} as { [k: string]: boolean }),
      }, transaction);

      if (isolated) {
        await transaction.commit();
      }
      return updated;
    } catch (err) {
      if (isolated) {
        await transaction.rollback();
      }
      throw err;
    }
  }

  public async validateCredentials(credentials: Partial<OIDCAccountCredentials>): Promise<void> {
    const result = this.testCredentials(credentials);
    if (result !== true) {
      throw new Errors.ValidationError(result);
    }
  }

  /* transaction and migration lock for distributed system */
  public abstract async transaction(): Promise<Transaction>;

  public abstract async acquireMigrationLock(key: string): Promise<void>;

  public abstract async touchMigrationLock(key: string, migratedIdentitiesNumber: number): Promise<void>;

  public abstract async releaseMigrationLock(key: string): Promise<void>;
}

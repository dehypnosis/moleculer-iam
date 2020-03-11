import * as _ from "lodash";
import * as vm from "vm";
import Terser from "terser";
import hashObject from "object-hash";
import { validator, ValidationError } from "../../helper/validator";
import { Logger } from "../../helper/logger";
import { IAMErrors } from "../error";
import { IDPAdapter } from "../adapter";
import { IdentityClaimsSchema, IdentityClaimsSchemaPayload, IdentityClaimsSchemaPayloadValidationSchema } from "./types";
import { OIDCAccountClaims } from "../../op";
import { defaultIdentityClaimsManagerOptions } from "./options";
import { Transaction } from "../adapter";
import { WhereAttributeHash } from "../../helper/rdbms";

export type IdentityClaimsManagerProps = {
  adapter: IDPAdapter;
  logger?: Logger;
};

export type IdentityClaimsManagerOptions = {
  baseClaims?: IdentityClaimsSchemaPayload[],
  mandatoryScopes?: string[],
};

export class IdentityClaimsManager {
  private readonly validatePayload: (object: any) => (true | ValidationError[]);
  private readonly logger: Logger;
  private readonly options: IdentityClaimsManagerOptions;

  constructor(protected readonly props: IdentityClaimsManagerProps, opts?: Partial<IdentityClaimsManagerOptions>) {
    this.logger = props.logger || console;

    // compile payload validation functions
    this.validatePayload = validator.compile(IdentityClaimsSchemaPayloadValidationSchema);

    // prepare base claims
    this.options = _.defaultsDeep(opts || {}, defaultIdentityClaimsManagerOptions);
    this.mandatoryScopes = [...new Set(this.options.mandatoryScopes!.concat(["openid"]))];
  }

  private get adapter() {
    return this.props.adapter;
  }

  /* lifecycle */
  public async start(): Promise<void> {
    // define mandatory claims and base claims
    const payloads: IdentityClaimsSchemaPayload[] = [
      {
        scope: "openid",
        key: "sub",
        description: "account id",
        validation: "string",
        immutable: true,
        unique: true,
      },
      ...this.options.baseClaims!,
    ];

    for (const payload of payloads) {
      await this.defineClaimsSchema(payload);
    }

    await this.syncSupportedScopes();

    this.logger.info("identity claims manager has been started");
  }

  public async stop(): Promise<void> {
    this.logger.info("identity claims manager has been stopped");
  }

  /* to update claims schema */
  private hashClaimsSchemaPayload(payload: IdentityClaimsSchemaPayload) {
    return hashObject(payload, {
      algorithm: "md5",
      unorderedArrays: true,
      unorderedObjects: true,
      unorderedSets: true,
    });
  }

  private createClaimsSchema(payload: IdentityClaimsSchemaPayload) {
    const result = this.validatePayload(payload);
    if (result !== true) {
      throw new IAMErrors.ValidationFailed(result, {
        payload,
      });
    }

    // normalize migration codes
    const {code, error} = Terser.minify(`(${payload.migration!})(oldClaim, claims);`, {ecma: 6, compress: false, mangle: false, output: {beautify: true, indent_level: 2}});
    if (error) {
      throw error;
    }
    payload.migration = code;

    const schema: IdentityClaimsSchema = {
      ...payload,
      version: this.hashClaimsSchemaPayload(payload),
      active: true,
    };

    return schema;
  }

  private compileClaimsValidator(schema: IdentityClaimsSchema) {
    const validate = validator.compile({
      [schema.key]: schema.validation,
      $$strict: true,
    });

    return (claims: { [claimKey: string]: any }): void => {
      const result = validate(claims);
      if (result !== true) {
        throw new IAMErrors.ValidationFailed(result, claims);
      }
    };
  }

  private compileClaimsMigrationStrategy(schema: IdentityClaimsSchema) {
    // compile function
    try {
      const script = new vm.Script(schema.migration!, {
        displayErrors: true,
        timeout: 100,
      });

      // uncomment to read function codes on jest cov_ errors
      // console.log(`(${schema.migration!})(oldClaim, claims)`);

      return (oldClaim: any, claims: any): any => {
        return script.runInNewContext({oldClaim, claims});
      };
    } catch (error) {
      throw new IAMErrors.ValidationFailed([], {migration: schema.migration, error});
    }
  }

  public readonly mandatoryScopes: ReadonlyArray<string> = [];

  private _supportedScopes: {[scope: string]: string[]} = {};
  public get supportedScopes(): {[scope: string]: string[]} {
    return this._supportedScopes;
  }
  private async syncSupportedScopes() {
    // update supported scope information
    this._supportedScopes = await this.getActiveClaimsSchemata()
      .then(schemata =>
        schemata.reduce((scopes, schema) => {
          scopes[schema.scope] = (scopes[schema.scope] || []).concat(schema.key);
          return scopes;
        }, {} as any)
      );
  }

  public async onClaimsSchemaUpdated() {
    await this.adapter.onClaimsSchemaUpdated();
    await this.syncSupportedScopes();
    return;
  }

  public async getActiveClaimsSchemata() {
    return this.adapter.getClaimsSchemata({scope: [], active: true});
  }

  public async getClaimsSchemata(args: { scope: string | string[], key?: string, version?: string, active?: boolean }) {
    if (typeof args.scope === "string") {
      args = {...args, scope: args.scope.split(" ").filter(s => !!s)};
    } else if (typeof args.scope === "undefined") {
      args = {...args, scope: []};
    }
    return this.adapter.getClaimsSchemata(args as any);
  }

  public async getClaimsSchema(args: { key: string, version?: string, active?: boolean }) {
    return this.adapter.getClaimsSchema(args);
  }

  public async forceReloadClaims(args: { where?: WhereAttributeHash, ids?: string[] }) {
    this.logger.info(`force reload identity claims: onClaimsUpdated()`, args);
    let transaction: Transaction;
    try {
      transaction = await this.adapter.transaction();

      // search and reload
      if (args.where) {
        // migrate in batches
        const limit = 100;
        let offset = 0;
        while (true) {
          const ids = await this.adapter.get({where: args.where, offset, limit});
          if (ids.length === 0) {
            break;
          }
          await Promise.all(ids.map(async id => {
            try {
              await this.adapter.onClaimsUpdated(id, {}, transaction);
            } catch (error) {
              this.logger.error("failed to reload user claims", id, error);
              throw error;
            }
          }));
          offset += limit;
        }
      }

      // reload directly
      if (args.ids && args.ids.length > 0) {
        await Promise.all(args.ids.map(async id => {
          try {
            await this.adapter.onClaimsUpdated(id, {}, transaction);
          } catch (error) {
            this.logger.error("failed to reload user claims", id, error);
            throw error;
          }
        }));
      }

      await transaction.commit();

    } catch (error) {
      this.logger.error(`force reload identity claims failed`, error);
      if (transaction!) {
        await transaction!.rollback();
      }
      throw error;
    }
  }

  public async forceDeleteClaimsSchemata(...keys: string[]): Promise<void> {
    for (const key of keys) {
      await this.adapter.acquireMigrationLock(key);
      const transaction = await this.adapter.transaction();
      try {
        this.logger.info("force delete claims schema:", key);
        await this.adapter.forceDeleteClaimsSchema(key, transaction);
        await this.adapter.onClaimsSchemaUpdated();
        await transaction.commit();
      } catch (error) {
        this.logger.error("failed to force delete claims schema:", key);
        await transaction!.rollback();
        throw error;
      } finally {
        await this.adapter.releaseMigrationLock(key);
      }
    }
  }

  public async defineClaimsSchema(payload: IdentityClaimsSchemaPayload): Promise<IdentityClaimsSchema> {
    await this.adapter.acquireMigrationLock(payload.key);

    try {
      // validate payload and create schema
      const schema = this.createClaimsSchema(payload);
      const scopeFilter: WhereAttributeHash = {metadata: {scope: {[schema.scope]: true}}};

      // compile claims schema and validate it with default value
      const validateClaims = this.compileClaimsValidator(schema);

      // compile migration function
      const migrateClaims = this.compileClaimsMigrationStrategy(schema);

      // restore inactive schema version if does
      const inactiveSchema: IdentityClaimsSchema | void = await this.adapter.getClaimsSchema({key: schema.key, version: schema.version, active: false});
      if (inactiveSchema) {
        this.logger.info(`activate identity claims schema for ${schema.key}:${schema.version.substr(0, 8)}`);
        // tslint:disable-next-line:no-shadowed-variable
        const transaction = await this.adapter.transaction();
        try {
          // activate
          await this.adapter.setActiveClaimsSchema({key: schema.key, version: schema.version}, transaction);

          // migrate in batches
          const limit = 100;
          let offset = 0;
          while (true) {
            const identities = await this.adapter.get({offset, limit, where: scopeFilter});
            if (identities.length === 0) {
              break;
            }
            await Promise.all(identities.map(async identity => {
              try {
                await this.adapter.onClaimsUpdated(identity, {}, transaction);
              } catch (error) {
                this.logger.error("failed to update user claims", error);
                throw error;
              }
            }));

            // notice current migration is alive
            if (this.adapter.touchMigrationLock) {
              await this.adapter.touchMigrationLock(schema.key, offset + identities.length);
            }

            offset += limit;
          }

          await this.adapter.onClaimsSchemaUpdated();
          await transaction.commit();
          return schema;

        } catch (error) {
          this.logger.error(`identity claims migration failed`, error);
          await transaction!.rollback();
          throw error;
        }
      }

      // get current active schema
      const activeSchema: IdentityClaimsSchema | void = await this.adapter.getClaimsSchema({key: schema.key, active: true});

      // if has exactly same schema
      if (activeSchema && activeSchema.version === schema.version) {
        this.logger.info(`skip identity claims schema migration for ${activeSchema.key}:${activeSchema.version.substr(0, 8)}`);
        await this.adapter.onClaimsSchemaUpdated(); // for the case of distributed system
        return activeSchema;
      }

      // get target schema
      let parentSchema: IdentityClaimsSchema | void;
      if (schema.parentVersion) { // from specific version
        parentSchema = await this.adapter.getClaimsSchema({key: schema.key, version: schema.parentVersion});
        if (!parentSchema) {
          throw new IAMErrors.ValidationFailed([], {parentVersion: schema.parentVersion});
        }
      } else {
        parentSchema = activeSchema;
        schema.parentVersion = parentSchema ? parentSchema.version : undefined;
      }

      // update user client claims
      this.logger.info(`start identity claims migration: ${schema.key}:${schema.parentVersion ? schema.parentVersion.substr(0, 8) + " -> " : ""}${schema.version.substr(0, 8)}`);
      // begin transaction
      const transaction = await this.adapter.transaction();
      try {

        // create new claims schema
        await this.adapter.createClaimsSchema(schema, transaction);
        await this.adapter.setActiveClaimsSchema({key: schema.key, version: schema.version}, transaction);

        // migrate in batches
        const limit = 100;
        let offset = 0;

        while (true) {
          const ids = await this.adapter.get({offset, limit, where: scopeFilter});
          if (ids.length === 0) {
            break;
          }
          await Promise.all(ids.map(async (id, index) => {
            // validate new claims and save
            let oldClaim: any;
            let newClaim: any;
            let claims: OIDCAccountClaims;
            try {
              // create new value
              claims = await this.adapter.getClaims(id, []);
              oldClaim = parentSchema
                ? await this.adapter.getVersionedClaims(id, [{
                  key: schema.key,
                  schemaVersion: schema.parentVersion,
                }])
                  .then(result => result[schema.key])
                : undefined;
              oldClaim = typeof oldClaim === "undefined" ? null : oldClaim;

              newClaim = migrateClaims(oldClaim, claims);
              newClaim = typeof newClaim === "undefined" ? null : newClaim;

              // validate and re-assign (may) sanitized value
              const newClaims = {[schema.key]: newClaim};
              validateClaims(newClaims); // in migration, schema.unique property is ignored
              newClaim = newClaims[schema.key];

              this.logger.info(`migrate user claims ${id}:${schema.key}:${schema.version.substr(0, 8)}`, oldClaim, "->", newClaim);

              await this.adapter.createOrUpdateVersionedClaims(id, [{
                key: schema.key,
                value: newClaim,
                schemaVersion: schema.version,
              }], transaction);

              if (JSON.stringify(oldClaim) !== JSON.stringify(newClaim)) {
                await this.adapter.onClaimsUpdated(id, {[schema.key]: newClaim}, transaction);
              }
            } catch (error) {
              const detail = {id, oldClaim, newClaim, error, index: index + offset};
              this.logger.error("failed to update user claims", detail);
              throw new IAMErrors.ValidationFailed([], detail);
            }
          }));

          // notice current migration is alive
          if (this.adapter.touchMigrationLock) {
            await this.adapter.touchMigrationLock(schema.key, offset + ids.length);
          }

          offset += limit;
        }

        // commit transaction
        await this.adapter.onClaimsSchemaUpdated();
        await transaction.commit();

        this.logger.info(`identity claims migration finished: ${schema.key}:${schema.parentVersion ? schema.parentVersion.substr(0, 8) + " -> " : ""}${schema.version.substr(0, 8)}`);
        return schema;

      } catch (error) { // failed to migrate, revoke migration

        this.logger.error(`identity claims migration failed:`, error);
        await transaction.rollback();

        throw error;
      }
    } finally {
      await this.adapter.releaseMigrationLock(payload.key);
    }
  }
}

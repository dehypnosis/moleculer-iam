import * as _ from "lodash";
import * as vm from "vm";
import hashObject from "object-hash";
import { validator, ValidationError } from "../../validator";
import { Logger } from "../../logger";
import { Errors } from "../error";
import { IDPAdapter } from "../adapter";
import { IdentityClaimsSchema, IdentityClaimsSchemaPayload, IdentityClaimsSchemaPayloadValidationSchema } from "./types";
import { OIDCAccountClaims } from "../../oidc";

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
    this.options = _.defaultsDeep(opts || {}, {
      baseClaims: [
        {
          scope: "profile",
          key: "name",
          validation: "string",
        },
        {
          scope: "profile",
          key: "picture",
          validation: {
            type: "string",
            optional: true,
          },
        },
        {
          scope: "email",
          key: "email",
          validation: {
            type: "email",
            normalize: true,
          },
        },
        {
          scope: "email",
          key: "email_verified",
          validation: {
            type: "boolean",
            default: false,
          },
        },
        {
          scope: "phone",
          key: "phone_number",
          validation: {
            type: "phone",
            country: "KR",  // TODO: locale from context...
          },
        },
        {
          scope: "phone",
          key: "phone_number_verified",
          validation: {
            type: "boolean",
            default: false,
          },
        },
      ],
      mandatoryScopes: [
        "openid",
        "profile",
        "email",
        // "phone",
      ],
    });
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
      },
      ...this.options.baseClaims!,
    ];

    await Promise.all(payloads.map(payload => this.defineClaimsSchema(payload)));

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
      throw new Errors.ValidationError(result, {
        payload,
      });
    }

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

    return (claims: any): void => {
      const result = validate({[schema.key]: claims});
      if (result !== true) {
        throw new Errors.ValidationError(result, {
          [schema.key]: claims,
        });
      }
    };
  }

  private compileClaimsMigrationStrategy(schema: IdentityClaimsSchema) {
    // compile function
    try {
      const script = new vm.Script(`(${schema.migration!})(oldClaim, seedClaim, claims)`, {
        displayErrors: true,
        timeout: 100,
      });

      return (oldClaim: any, seedClaim: any, claims: any): any => {
        return script.runInNewContext({oldClaim, seedClaim: _.cloneDeep(seedClaim), claims});
      };
    } catch (error) {
      throw new Errors.ValidationError([], {migration: schema.migration, error});
    }
  }

  public get mandatoryScopes(): ReadonlyArray<string> {
    return [...new Set(this.options.mandatoryScopes!.concat(["openid"]))];
  }

  public async getActiveClaimsSchemata() {
    return this.props.adapter.getClaimsSchemata({scope: [], active: true});
  }

  public async defineClaimsSchema(payload: IdentityClaimsSchemaPayload): Promise<IdentityClaimsSchema> {
    await this.props.adapter.acquireMigrationLock(payload.key);

    try {
      // validate payload and create schema
      const schema = this.createClaimsSchema(payload);

      // compile claims schema and validate it with default value
      const validateClaims = this.compileClaimsValidator(schema);

      // compile migration function
      const migrateClaims = this.compileClaimsMigrationStrategy(schema);

      // restore inactive schema version if does
      const inactiveSchema: IdentityClaimsSchema | void = await this.props.adapter.getClaimsSchema({key: schema.key, version: schema.version, active: false});
      if (inactiveSchema) {
        await this.props.adapter.setActiveClaimsSchema({key: schema.key, version: schema.version});
        this.logger.info(`activate identity claims schema for ${schema.key}:${schema.version.substr(0, 8)}`);

        // clear cache
        if (this.props.adapter.clearClaimsCache) {
          await this.props.adapter.clearClaimsCache();
        }
        return schema;
      }

      // get current active schema
      const activeSchema: IdentityClaimsSchema | void = await this.props.adapter.getClaimsSchema({key: schema.key, active: true});

      // if has exactly same schema
      if (activeSchema && activeSchema.version === schema.version) {
        this.logger.info(`skip identity claims schema migration for ${activeSchema.key}:${activeSchema.version.substr(0, 8)}`);
        return activeSchema;
      }

      // get target schema
      let parentSchema: IdentityClaimsSchema | void;
      if (schema.parentVersion) { // from specific version
        parentSchema = await this.props.adapter.getClaimsSchema({key: schema.key, version: schema.parentVersion});
        if (!parentSchema) {
          throw new Errors.ValidationError([], {parentVersion: schema.parentVersion});
        }
      } else {
        parentSchema = activeSchema;
        schema.parentVersion = parentSchema ? parentSchema.version : undefined;
      }

      // update user client claims
      this.logger.debug(`start identity claims migration: ${schema.key}:${schema.parentVersion ? schema.parentVersion.substr(0, 8) + " -> " : ""}${schema.version.substr(0, 8)}`);
      try {
        // begin transaction
        await this.props.adapter.beginMigration(schema.key);

        // create new claims schema
        await this.props.adapter.putClaimsSchema(schema, schema.key);
        await this.props.adapter.setActiveClaimsSchema({key: schema.key, version: schema.version}, schema.key);

        // migrate in batches
        const limit = 100;
        let offset = 0;
        let index = 0;

        while (true) {
          const identities = await this.props.adapter.get({offset, limit}, {softDeleted: undefined});
          for (const identity of identities) {

            // validate new claims and save
            let oldClaim: any;
            let newClaim: any;
            let claims: OIDCAccountClaims;
            try {
              // create new value
              claims = await identity.claims();
              oldClaim = parentSchema
                ? await this.props.adapter.getClaimsVersion(identity, [{
                  key: schema.key,
                  schemaVersion: schema.parentVersion,
                }])
                  .then(result => result[schema.key])
                : undefined;
              oldClaim = typeof oldClaim === "undefined" ? null : oldClaim;
              newClaim = migrateClaims(oldClaim, schema.seed, claims);
              newClaim = typeof newClaim === "undefined" ? null : newClaim;
              this.logger.debug(`migrate user claims ${identity.id}:${schema.key}:${schema.version.substr(0, 8)}`, oldClaim, "->", newClaim);

              // validate and store it
              validateClaims(newClaim);

              await this.props.adapter.putClaimsVersion(identity, [{
                key: schema.key,
                value: newClaim,
                schemaVersion: schema.version,
              }], schema.key);
            } catch (error) {
              const detail = {id: identity.id, oldClaim, newClaim, error, index};
              this.logger.error("failed to update user claims", detail);
              throw new Errors.ValidationError([], detail);
            }
            index++;
          }

          if (identities.length === 0) {
            break;
          }
          offset += limit;
        }

        // commit transaction
        await this.props.adapter.commitMigration(schema.key);

        // clear cache
        if (this.props.adapter.clearClaimsCache) {
          await this.props.adapter.clearClaimsCache();
        }

        this.logger.info(`identity claims migration finished: ${schema.key}:${schema.parentVersion ? schema.parentVersion.substr(0, 8) + " -> " : ""}${schema.version.substr(0, 8)}`);
        return schema;

      } catch (error) { // failed to migrate, revoke migration

        this.logger.error(`identity claims migration failed`, error);

        // rollback transaction
        await this.props.adapter.rollbackMigration(schema.key);

        throw error;
      }
    } finally {
      await this.props.adapter.releaseMigrationLock(payload.key);
    }
  }
}

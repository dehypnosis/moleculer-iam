import { ValidationRule, ValidationSchema } from "../../validator";
import { OIDCAccountClaims } from "../../oidc";

export interface IdentityClaimsSchema extends IdentityClaimsSchemaPayload {
  // internally calculated hash of whole definition props which denote unique version from this claims versions
  version: string;
  active: boolean;
}

export interface IdentityClaimsSchemaPayload {
  /*
    visible scope name, use "openid" for default
  */
  scope: string;

  /*
    Unique key for the custom claims, cannot be modified later.
    Claims will be embeded in id_token and userinfo with this key.
  */
  key: string;

  /*
    Claims validation rule.
    ref: https://github.com/icebob/fastest-validator#usage
  */
  validation: ValidationRule;

  /*
    A string denotes a JavaScript function which will be used to migrate old claims to new schema.
    When a schema is defined newly or updated, batched migration will be performed for whole users.
    And for the new user, migration will be performed.

    Merged value with merge migration will be validated with given schema.
    For the batched migration, single failure will rollback all the batched migrations process.

    eg. accept seed value from new version if old claim is undefined.
    migration: `(oldClaim, seedClaim, claims) => {
      return typeof oldClaim === "undefined" || oldClaim === null ? seedClaim : oldClaim;
    }`,

    eg2. merge object properties while old claim take precedence over new default claim.
    migration: `(oldClaim, seedClaim, claims) => {
      return { ...seedClaim, ...oldClaim };
    }`

    eg3. use other claims in migration.
    migration: `(oldClaim, seedClaim, claims) => {
      return claims.otherValue;
    }`
   */
  migration?: string;
  seed?: any;

  /*
    Optional version string denote that migrate old user claims from specific version.
    Without version number, claims from the direct parent will be used in merging.
  */
  parentVersion?: string;

  // optional description
  description?: string;
}

const defaultMigration = (oldClaim: any, seedClaim: any, claims: OIDCAccountClaims) => {
  return typeof oldClaim === "undefined" || oldClaim === null
    ? seedClaim
    : (
      typeof oldClaim === "object"
        ? (
          Array.isArray(oldClaim) && Array.isArray(seedClaim)
            ? Array.from(new Set([...seedClaim, ...oldClaim]))
            : {...seedClaim, ...oldClaim}
        )
        : oldClaim
    );
};

export const IdentityClaimsSchemaPayloadValidationSchema: ValidationSchema = {
  scope: {
    type: "string",
    description: `
      visible scope name, use "openid" for default
    `,
    alphadash: true,
    lowercase: true,
    trim: true,
  },
  key: {
    type: "string",
    description: `
      Unique key for the custom claims, cannot be modified later.
      Claims will be embedded in id_token and userinfo with this key.
    `,
    alphadash: true,
    lowercase: true,
    pattern: /^(?!(metadata)).*$/i, // metadata is preserved
    trim: true,
  },
  description: {
    type: "string",
    description: "Optional description.",
    trim: true,
    optional: true,
  },
  validation: {
    type: "any",
    description: `
      Claims validation rule.
      ref: https://github.com/icebob/fastest-validator#usage
    `,
  },
  migration: {
    type: "string",
    description: `
      A string denotes a JavaScript function which will be used to migrate old claims to new schema.
      When a schema is defined newly or updated, batched migration will be performed for whole users.
      And for the new user, migration will be performed.

      Merged value with merge strategy will be validated with given schema.
      For the batched migration, single failure will rollback all the batched migrations process.

      eg. accept default value from new version if old value is undefined.
      migration: \`(oldClaim, seedClaim, claims) => {
        return typeof oldClaim === "undefined" || oldClaim === null ? seedClaim : oldClaim;
      }\`,

      eg2. merge object properties while old value take precedence over new default value.
      migration: \`(oldClaim, seedClaim, claims) => {
        return { ...seedClaim, ...oldClaim };
      }\`

      eg3. use other claims in migration.
      migration: \`(oldClaim, seedClaim, claims) => {
        return claims.otherValue;
      }\`

      eg4. default migration function.
      migration: \`(oldClaim, seedClaim, claims) => {
        return typeof oldClaim === "undefined" || oldClaim === null
          ? seedClaim
          : (
            typeof oldClaim === "object"
              ? (
                Array.isArray(oldClaim) && Array.isArray(seedClaim)
                  ? Array.from(new Set([...seedClaim, ...oldClaim]))
                  : { ...seedClaim, ...oldClaim }
              )
              : oldClaim
          );
      };\`
    `,
    default: defaultMigration.toString(),
    trim: true,
  },
  seed: {
    type: "any",
    description: `Default claim value for migration.`,
    optional: true,
  },
  parentVersion: {
    type: "string",
    description: `
      Optional version string denote that migrate old user claims from specific version.
      Without version number, claims from the direct parent will be used in merging.
    `,
    optional: true,
  },
  $$strict: true,
};

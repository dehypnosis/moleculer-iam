"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* istanbul ignore next */
const defaultMigration = (oldClaim, claims) => {
    return typeof oldClaim === "undefined" ? null : oldClaim;
};
exports.IdentityClaimsSchemaPayloadValidationSchema = {
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
      Claims will be embedded in userinfo token with this key.
    `,
        alphadash: true,
        lowercase: true,
        pattern: /^(?!(metadata)).*$/i,
        trim: true,
    },
    description: {
        type: "string",
        description: "Optional description.",
        trim: true,
        optional: true,
    },
    unique: {
        type: "boolean",
        description: "denote defined claim should be unique among all the identities.",
        optional: true,
        default: false,
    },
    immutable: {
        type: "boolean",
        description: "denote defined claim should not be updated after set once.",
        optional: true,
        default: false,
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

      eg. remain old value. (default)
      migration: \`(oldClaim, claims) => {
        return typeof oldClaim === "undefined" ? null : oldClaim;
      }\`,

      eg2. extend old object with a new property.
      migration: \`(oldClaim, claims) => {
        return { ...oldClaim, emailLength: claims.email.length };
      }\`

      eg3. extend old array with a new item.
      migration: \`(oldClaim, claims) => {
        return (oldClaim || []).concat(["2020-01-03", claims.birthdate]);
      }\`
    `,
        default: defaultMigration.toString(),
        trim: true,
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
//# sourceMappingURL=types.js.map
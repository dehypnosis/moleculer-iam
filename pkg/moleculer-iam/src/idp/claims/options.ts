import { IdentityClaimsManagerOptions } from "./claims";

export const defaultIdentityClaimsManagerOptions: IdentityClaimsManagerOptions = {
  baseClaims: [
    {
      scope: "profile",
      key: "name",
      validation: {
        type: "string",
        empty: false,
        trim: true,
      },
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
      unique: true,
      immutable: true,
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
      },
      unique: true,
      immutable: true,
    },
    {
      scope: "phone",
      key: "phone_number_verified",
      validation: {
        type: "boolean",
        default: false,
      },
    },
    {
      scope: "gender",
      key: "gender",
      validation: {
        type: "enum",
        values: ["male", "female", "other"],
      },
    },
    {
      scope: "birthdate",
      key: "birthdate",
      description: "YYYY-MM-DD",
      validation: {
        type: "string",
        // need to serialize regexps like this
        pattern: /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/.source.toString(), // yyyy-mm-dd
      },
    },
    {
      scope: "impersonation",
      key: "impersonator",
      description: "an account which is able to pretend other accounts (dangerous feature)",
      validation: {
        type: "boolean",
        default: false,
      },
      immutable: true,
    },
  ],
  mandatoryScopes: [
    "openid",
    "profile",
    "email",
    // "phone",
  ],
};


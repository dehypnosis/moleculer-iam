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
        pattern: /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/, // yyyy-mm-dd
      },
    },
  ],
  mandatoryScopes: [
    "openid",
    "profile",
    "email",
    // "phone",
  ],
};

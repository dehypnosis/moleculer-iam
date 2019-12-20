import { IdentityClaimsManagerOptions } from "./claims";

export const defaultIdentityClaimsManagerOptions: IdentityClaimsManagerOptions = {
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
};

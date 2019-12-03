import crypto from "crypto";
import { Configuration } from "./types";
import { OIDCAdapterConstructorOptions } from "../adapter";
import { InteractionConfigurationKeys, InternalInteractionDeviceFlowConfigurationKeys, ClientApplicationRendererOptions } from "../interaction";

export type OIDCProviderOptions = Omit<Configuration, "adapter"> & {
  issuer: string,
  trustProxy?: boolean,
  adapter?: OIDCAdapterConstructorOptions,
  findAccount?: never;
  features?: Configuration["features"] & {
    devInteractions?: never;
    deviceFlow?: Required<Configuration>["features"]["deviceFlow"] & {
      [key in InternalInteractionDeviceFlowConfigurationKeys]?: never;
    };
  },
}
  & { [key in InteractionConfigurationKeys]?: never; }
  & { app?: ClientApplicationRendererOptions };

export const defaultOIDCProviderOptions: OIDCProviderOptions = {
  issuer: "http://localhost:8080",
  adapter: {
    type: "Memory",
    options: {},
  },
  trustProxy: true,

  /* ref: https://github.com/panva/node-oidc-provider/blob/master/docs/README.md */
  features: {
    /* token issue and management features */
    userinfo: {enabled: true},
    introspection: {enabled: true},
    revocation: {enabled: true},
    backchannelLogout: {enabled: true},
    frontchannelLogout: {enabled: true},
    sessionManagement: {enabled: true},
    webMessageResponseMode: {enabled: true},
    deviceFlow: { enabled: true },

    /* dynamic client registration */
    registration: {enabled: true},
    registrationManagement: {enabled: true},

    /* turn off development feature which composes dummy interactions */
    devInteractions: ({enabled: false}) as never,
  },

  /* tokens TTL in seconds */
  responseTypes: [
    "code", // authorization flow
    "id_token", "id_token token", // implicit flow
    "code id_token", "code token", "code id_token token", // hybrid flow
    "none",
  ],
  subjectTypes: [
    "public",
    "pairwise",
  ],
  pairwiseIdentifier(ctx, sub, client) {
    return crypto.createHash("sha256")
      .update(client.sectorIdentifier)
      .update(sub)
      .digest("hex");
  },
  pkceMethods: [
    "S256",
    "plain",
  ],

  /* additional discovery properties */
  discovery: {
    claim_types_supported: [
      "normal",
    ],
    claims_locales_supported: ["en-US"],
    ui_locales_supported: ["en-US"],
    display_values_supported: ["page", "popup"],
    op_policy_uri: null,
    op_tos_uri: null,
    service_documentation: null,
  },
};

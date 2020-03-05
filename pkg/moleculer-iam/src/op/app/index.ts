import * as _ from "lodash";
import { interactionPolicy, errors } from "oidc-provider";
import { ProviderConfigBuilder } from "../proxy";
import { ApplicationRendererFactory, ApplicationRendererFactoryFactoryOptions } from "../proxy";
import { IdentityFederationProviderOptions, identityFederationProviderOptionsPreset } from "./federation";
import { buildApplicationActionEndpoints } from "./actions";
import { buildAbortRoutes } from "./abort";
import { buildFindEmailRoutes } from "./find_email";
import { buildResetPasswordRoutes } from "./reset_password";
import { buildVerifyEmailRoutes } from "./verify_email";
import { buildVerifyPhoneRoutes, IdentityPhoneVerificationOptions } from "./verify_phone";
import { buildRegisterRoutes, IdentityRegisterOptions } from "./register";
import { buildFederateRoutes } from "./federate";
import { buildLoginRoutes } from "./login";
import { buildConsentRoutes } from "./consent";

export interface ApplicationBuildOptions {
  prefix?: string;
  federation?: IdentityFederationProviderOptions;
  renderer?: {
    factory?: ApplicationRendererFactory;
    options?: ApplicationRendererFactoryFactoryOptions;
  };
  register?: IdentityRegisterOptions;
  phoneVerification?: IdentityPhoneVerificationOptions;
}

export function buildApplication(builder: ProviderConfigBuilder, opts: ApplicationBuildOptions = {}): void {
  const { prefix = "/op", federation = {}, renderer = {} } = opts;

  builder
    // set routes url prefix
    .setPrefix(prefix)

    // extend client metadata
    .setExtraClientMetadata({
      // skip consent phase for skip_consent feature enabled client
      properties: ["skip_consent"],
      validator(k, v, meta) {
        switch (k) {
          case "skip_consent":
            if (typeof v !== "boolean") {
              // throw new errors.InvalidClientMetadata("skip_consent should be boolean type value");
              meta.skip_consent = false;
            }
            break;
          default:
            throw new errors.InvalidClientMetadata("unknown client property: " + k);
        }
      },
    })

    // support extra params for /auth?change_account=true&blabla to not auto-fill signed in session account
    .setExtraParams(["change_account"])

    // configure app
    .app

    // set supported prompts (), custom policies like: MFA, captcha, rate limit can be added
    .setPrompts([
      interactionPolicy.base().get("login"),
      interactionPolicy.base().get("consent"),
    ])

    // set app renderer
    .setRendererFactory(renderer.factory || require("moleculer-iam-interaction-renderer"), renderer.options)

    // configure federation
    .federation

    // callback URL is /op/federate/:providerName
    .setCallbackPrefix("/federate")
    .setProviderConfigurationMap(_.defaultsDeep(federation, identityFederationProviderOptionsPreset));

  // build app routes
  const actions = buildApplicationActionEndpoints(builder, opts);
  buildAbortRoutes(builder, opts, actions);
  buildFindEmailRoutes(builder, opts, actions);
  buildVerifyEmailRoutes(builder, opts, actions);
  buildVerifyPhoneRoutes(builder, opts, actions);
  buildResetPasswordRoutes(builder, opts, actions);
  buildRegisterRoutes(builder, opts, actions);
  buildFederateRoutes(builder, opts, actions);
  buildLoginRoutes(builder, opts, actions);
  buildConsentRoutes(builder, opts, actions);
}

import { interactionPolicy, errors } from "oidc-provider";
import { IdentityFederationManager, IdentityFederationManagerOptions } from "./federation";
import { ProviderConfigBuilder } from "../proxy";
import { InteractionRenderer, InteractionRendererFactory } from "./renderer";
import { buildInteractionActionEndpoints } from "./routes";
import { buildAbortRoutes } from "./routes.abort";
import { buildFindEmailRoutes } from "./routes.find_email";
import { buildResetPasswordRoutes } from "./routes.reset_password";
import { buildVerifyEmailRoutes } from "./routes.verify_email";
import { buildVerifyPhoneRoutes } from "./routes.verify_phone";
import { buildRegisterRoutes } from "./routes.register";
import { buildFederationRoutes } from "./routes.federation";
import { buildLoginRoutes } from "./routes.login";
import { buildConsentRoutes } from "./routes.consent";

export interface InteractionBuildOptions {
  prefix?: string;
  federation?: IdentityFederationManagerOptions;
  renderer?: InteractionRenderer;
}

export function buildDefaultInteractions(builder: ProviderConfigBuilder, opts: InteractionBuildOptions = {}): void {
  const { prefix = "/op", federation, renderer } = opts;

  builder
    // set routes url prefix
    .setPrefix(prefix)
    // set supported interactions, custom prompts like: MFA, captcha, rate limit, ... can be added
    .setInteractionPolicy([
      interactionPolicy.base().get("login"),
      interactionPolicy.base().get("consent"),
    ])
    // set default bridge for IDP and OP session and tokens (default)
    .setFindAccount((ctx, id, token) => {
      return builder.interaction.idp.findOrFail({id})
        .catch(async err => {
          await ctx.oidc.session.destroy();
          throw err;
        });
    })
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
    .setExtraParams(["change_account"]);

  // set interaction renderer
  const { render, routes } = new InteractionRendererFactory({
    logger: builder.logger,
    dev: builder.dev,
    prefix,
    metadata: builder.staticConfig.discovery!,
  }, renderer)
    .create();

  builder.interaction.setRenderFunction(render);
  builder.interaction.use(...routes);

  // create federation manager
  const federationManager = new IdentityFederationManager(builder, federation);

  // build interaction routes
  const actions = buildInteractionActionEndpoints(builder, opts, federationManager);
  buildAbortRoutes(builder, opts, actions);
  buildFindEmailRoutes(builder, opts, actions);
  buildVerifyEmailRoutes(builder, opts, actions);
  buildVerifyPhoneRoutes(builder, opts, actions);
  buildResetPasswordRoutes(builder, opts, actions);
  buildRegisterRoutes(builder, opts, actions);
  buildFederationRoutes(builder, opts, actions, federationManager);
  buildLoginRoutes(builder, opts, actions);
  buildConsentRoutes(builder, opts, actions);
}

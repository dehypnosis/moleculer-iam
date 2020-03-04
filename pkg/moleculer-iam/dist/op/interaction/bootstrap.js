"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const oidc_provider_1 = require("oidc-provider");
const federation_1 = require("./federation");
const renderer_1 = require("./renderer");
const routes_1 = require("./routes");
const routes_abort_1 = require("./routes.abort");
const routes_find_email_1 = require("./routes.find_email");
const routes_reset_password_1 = require("./routes.reset_password");
const routes_verify_email_1 = require("./routes.verify_email");
const routes_verify_phone_1 = require("./routes.verify_phone");
const routes_register_1 = require("./routes.register");
const routes_federation_1 = require("./routes.federation");
const routes_login_1 = require("./routes.login");
const routes_consent_1 = require("./routes.consent");
function buildDefaultInteractions(builder, opts = {}) {
    const { prefix = "/op", federation, renderer } = opts;
    builder
        // set routes url prefix
        .setPrefix(prefix)
        // set supported interactions, custom prompts like: MFA, captcha, rate limit, ... can be added
        .setInteractionPolicy([
        oidc_provider_1.interactionPolicy.base().get("login"),
        oidc_provider_1.interactionPolicy.base().get("consent"),
    ])
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
                    throw new oidc_provider_1.errors.InvalidClientMetadata("unknown client property: " + k);
            }
        },
    })
        // support extra params for /auth?change_account=true&blabla to not auto-fill signed in session account
        .setExtraParams(["change_account"]);
    // set interaction renderer
    const { render, routes } = new renderer_1.InteractionRendererFactory({
        logger: builder.logger,
        dev: builder.dev,
        prefix,
        metadata: builder.staticConfig.discovery,
    }, renderer)
        .create();
    builder.interaction.setRenderFunction(render);
    builder.interaction.use(...routes);
    // create federation manager
    const federationManager = new federation_1.IdentityFederationManager(builder, federation);
    // build interaction routes
    const actions = routes_1.buildInteractionActionEndpoints(builder, opts, federationManager);
    routes_abort_1.buildAbortRoutes(builder, opts, actions);
    routes_find_email_1.buildFindEmailRoutes(builder, opts, actions);
    routes_verify_email_1.buildVerifyEmailRoutes(builder, opts, actions);
    routes_verify_phone_1.buildVerifyPhoneRoutes(builder, opts, actions);
    routes_reset_password_1.buildResetPasswordRoutes(builder, opts, actions);
    routes_register_1.buildRegisterRoutes(builder, opts, actions);
    routes_federation_1.buildFederationRoutes(builder, opts, actions, federationManager);
    routes_login_1.buildLoginRoutes(builder, opts, actions);
    routes_consent_1.buildConsentRoutes(builder, opts, actions);
}
exports.buildDefaultInteractions = buildDefaultInteractions;
//# sourceMappingURL=bootstrap.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const _ = tslib_1.__importStar(require("lodash"));
const oidc_provider_1 = require("oidc-provider");
const actions_1 = require("./actions");
const abort_1 = require("./abort");
const federation_1 = require("../federation");
const find_email_1 = require("./find_email");
const reset_password_1 = require("./reset_password");
const verify_email_1 = require("./verify_email");
const verify_phone_1 = require("./verify_phone");
const register_1 = require("./register");
const federation_2 = require("./federation");
const login_1 = require("./login");
const consent_1 = require("./consent");
function buildDefaultInteractions(builder, opts = {}) {
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
                    throw new oidc_provider_1.errors.InvalidClientMetadata("unknown client property: " + k);
            }
        },
    })
        // support extra params for /auth?change_account=true&blabla to not auto-fill signed in session account
        .setExtraParams(["change_account"])
        // configure interaction
        .interaction
        // set supported prompts (), custom policies like: MFA, captcha, rate limit can be added
        .setPrompts([
        oidc_provider_1.interactionPolicy.base().get("login"),
        oidc_provider_1.interactionPolicy.base().get("consent"),
    ])
        // set interaction page renderer
        // .setPageRenderer(renderer.factory || require("moleculer-iam-interaction-renderer"), renderer.options)
        // configure federation
        .federation
        // callback URL is /op/federate/:providerName
        .setCallbackPrefix("/federate")
        .setProviderConfigurationMap(_.defaultsDeep(federation, federation_1.identityFederationProviderOptionsPreset));
    // build interaction routes
    const actions = actions_1.buildInteractionActionEndpoints(builder, opts);
    abort_1.buildAbortRoutes(builder, opts, actions);
    find_email_1.buildFindEmailRoutes(builder, opts, actions);
    verify_email_1.buildVerifyEmailRoutes(builder, opts, actions);
    verify_phone_1.buildVerifyPhoneRoutes(builder, opts, actions);
    reset_password_1.buildResetPasswordRoutes(builder, opts, actions);
    register_1.buildRegisterRoutes(builder, opts, actions);
    federation_2.buildFederationRoutes(builder, opts, actions);
    login_1.buildLoginRoutes(builder, opts, actions);
    consent_1.buildConsentRoutes(builder, opts, actions);
}
exports.buildDefaultInteractions = buildDefaultInteractions;
//# sourceMappingURL=index.js.map
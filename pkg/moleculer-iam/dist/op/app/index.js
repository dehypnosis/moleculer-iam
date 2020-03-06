"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const _ = tslib_1.__importStar(require("lodash"));
const oidc_provider_1 = require("oidc-provider");
const federation_1 = require("./federation");
const routes_1 = require("./routes");
const abort_1 = require("./abort");
const find_email_1 = require("./find_email");
const reset_password_1 = require("./reset_password");
const verify_email_1 = require("./verify_email");
const verify_phone_1 = require("./verify_phone");
const register_1 = require("./register");
const federate_1 = require("./federate");
const login_1 = require("./login");
const consent_1 = require("./consent");
function buildApplication(builder, opts = {}) {
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
        .setExtraParams([
        // support extra params for /login?change_account=true to not auto-fill signed in session account
        "change_account",
    ])
        // configure app
        .app
        // set supported prompts (), custom policies like: MFA, captcha, rate limit can be added
        .setPrompts([
        oidc_provider_1.interactionPolicy.base().get("login"),
        oidc_provider_1.interactionPolicy.base().get("consent"),
    ])
        .setRoutesFactory(routes_1.createApplicationRoutesFactory(builder, opts))
        // set app renderer
        .setRendererFactory(renderer.factory || require("moleculer-iam-interaction-renderer"), renderer.options)
        // configure federation
        .federation
        // callback URL is /op/federate/:providerName
        .setCallbackPrefix("/federate")
        .setProviderConfigurationMap(_.defaultsDeep(federation, federation_1.identityFederationProviderOptionsPreset));
    // build app routes
    abort_1.buildAbortRoutes(builder, opts);
    find_email_1.buildFindEmailRoutes(builder, opts);
    verify_email_1.buildVerifyEmailRoutes(builder, opts);
    verify_phone_1.buildVerifyPhoneRoutes(builder, opts);
    reset_password_1.buildResetPasswordRoutes(builder, opts);
    register_1.buildRegisterRoutes(builder, opts);
    federate_1.buildFederateRoutes(builder, opts);
    login_1.buildLoginRoutes(builder, opts);
    consent_1.buildConsentRoutes(builder, opts);
}
exports.buildApplication = buildApplication;
//# sourceMappingURL=index.js.map
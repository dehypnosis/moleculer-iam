"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const crypto_1 = tslib_1.__importDefault(require("crypto"));
exports.defaultOIDCProviderOptions = {
    issuer: "http://localhost:8080",
    adapter: {
        type: "Memory",
        options: {},
    },
    trustProxy: true,
    cookies: {
        short: {
            path: "/",
            maxAge: 1000 * 60 * 60 * 24,
        },
        long: {
            path: "/",
            maxAge: 1000 * 60 * 60 * 24 * 28,
        },
    },
    /* routes */
    routes: {
        jwks: "/oidc/jwks",
        authorization: "/oidc/auth",
        pushed_authorization_request: "/oidc/request",
        check_session: "/oidc/session/check",
        end_session: "/oidc/session/end",
        code_verification: "/oidc/device",
        device_authorization: "/oidc/device/auth",
        token: "/oidc/token",
        introspection: "/oidc/token/introspect",
        revocation: "/oidc/token/revoke",
        userinfo: "/oidc/userinfo",
        registration: "/oidc/client/register",
    },
    /* ref: https://github.com/panva/node-oidc-provider/blob/master/docs/README.md */
    features: {
        /* token issue and management features */
        userinfo: { enabled: true },
        introspection: { enabled: true },
        revocation: { enabled: true },
        backchannelLogout: { enabled: true },
        frontchannelLogout: { enabled: true },
        sessionManagement: { enabled: true },
        webMessageResponseMode: { enabled: true },
        deviceFlow: { enabled: true },
        /* dynamic client registration */
        registration: { enabled: true },
        registrationManagement: { enabled: true },
        /* turn off development feature which composes dummy interactions */
        devInteractions: ({ enabled: false }),
    },
    responseTypes: [
        "code",
        "id_token", "id_token token",
        "code id_token", "code token", "code id_token token",
        "none",
    ],
    subjectTypes: [
        "public",
        "pairwise",
    ],
    pairwiseIdentifier(ctx, sub, client) {
        return crypto_1.default.createHash("sha256")
            .update(client.sectorIdentifier)
            .update(sub)
            .digest("hex");
    },
    pkceMethods: [
        "S256",
        "plain",
    ],
    clientDefaults: {
        grant_types: ["implicit", "authorization_code", "refresh_token"],
        response_types: ["code", "id_token", "id_token token", "code id_token", "code token", "code id_token token", "none"],
        token_endpoint_auth_method: "none",
    },
    /* extra params for /auth?change_account=true&blabla to not auto-fill signed in session account */
    extraParams: ["change_account"],
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
//# sourceMappingURL=options.js.map
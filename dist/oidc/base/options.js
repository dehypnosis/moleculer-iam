"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultOIDCProviderBaseOptions = {
    features: {
        devInteractions: { enabled: false },
        encryption: { enabled: true },
        introspection: { enabled: true },
        revocation: { enabled: true },
        backchannelLogout: { enabled: true },
        frontchannelLogout: { enabled: true },
        sessionManagement: { enabled: true },
        webMessageResponseMode: { enabled: true },
        registration: { enabled: false },
        registrationManagement: { enabled: false },
    },
    formats: {
        AccessToken: "jwt",
    },
    // TODO: client management
    // TODO: account-device / session-token management
    // TODO: scope definition... + role/claimsSchema/group
    // TODO: where should account management go? for client side.
    // TODO: views....... as SPA? or... how to? should separate them all?
    renderError(ctx, out, error) {
        ctx.type = "json";
        // @ts-ignore
        ctx.status = error.status || error.statusCode || 500;
        ctx.body = out;
    },
};
//# sourceMappingURL=options.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const render_1 = require("./render");
// prompt user code for device flow
// ref: https://github.com/panva/node-oidc-provider/blob/74b434c627248c82ca9db5aed3a03f0acd0d7214/lib/actions/code_verification.js#L19
exports.userCodeInputSource = (ctx, formHTML, out, err) => {
    const oidc = ctx.oidc;
    render_1.renderInternalFlow(ctx, {
        action: {
            verify: {
                url: oidc.urlFor("code_verification"),
                method: "POST",
                data: {
                    user_code: oidc.params.user_code || null,
                },
            },
        },
        error: out,
    });
};
// confirm user code
// ref: https://github.com/panva/node-oidc-provider/blob/master/lib/helpers/defaults.js#L635
exports.userCodeConfirmSource = (ctx, form, client, deviceInfo, userCode) => {
    const oidc = ctx.oidc;
    render_1.renderInternalFlow(ctx, {
        data: {
            deviceInfo,
        },
        action: {
            confirm: {
                url: oidc.urlFor("code_verification"),
                method: "POST",
                data: {
                    user_code: userCode,
                    confirm: true,
                },
            },
            abort: {
                url: oidc.urlFor("code_verification"),
                method: "POST",
                data: {
                    user_code: userCode,
                    abort: true,
                },
            },
        },
    });
};
exports.successSource = (ctx) => {
    render_1.renderInternalFlow(ctx, {});
};
//# sourceMappingURL=device.js.map
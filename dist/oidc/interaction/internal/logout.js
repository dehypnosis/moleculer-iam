"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const render_1 = require("./render");
// signed out without post_logout_redirect_uri params
exports.postLogoutSuccessSource = (ctx) => {
    // const oidc = ctx.oidc as typeof ctx.state.oidc;
    render_1.renderInternalFlow(ctx, {});
};
// sign out
// ref: https://github.com/panva/node-oidc-provider/blob/c6b1770e68224b7463c1fa5c64199f0cd38131af/lib/actions/end_session.js#L88
exports.logoutSource = (ctx, formHTML) => {
    const oidc = ctx.oidc;
    render_1.renderInternalFlow(ctx, {
        action: {
            confirm: {
                url: oidc.urlFor("end_session_confirm"),
                method: "POST",
                data: {
                    logout: true,
                },
            },
        },
    });
};
//# sourceMappingURL=logout.js.map
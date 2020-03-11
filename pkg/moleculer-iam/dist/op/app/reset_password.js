"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const moment_1 = tslib_1.__importDefault(require("moment"));
const error_1 = require("./error");
function buildResetPasswordRoutes(builder, opts) {
    builder.app.router
        // initial render page
        .get("/reset_password", async (ctx) => {
        return ctx.op.render("reset_password");
    })
        // render set password page
        .get("/reset_password/set", async (ctx) => {
        if (!ctx.op.sessionPublicState.resetPassword || !ctx.op.sessionPublicState.resetPassword.user) {
            return ctx.op.redirect("/reset_password");
        }
        return ctx.op.render("reset_password");
    })
        .get("/reset_password/end", async (ctx) => {
        if (!ctx.op.sessionPublicState.resetPassword || !ctx.op.sessionPublicState.resetPassword.user) {
            return ctx.op.redirect("/reset_password");
        }
        return ctx.op.render("reset_password");
    })
        .post("/reset_password/set", async (ctx) => {
        const { email = "", password = "", password_confirmation = "" } = ctx.request.body;
        const claims = { email };
        await ctx.idp.validateEmailOrPhoneNumber(claims); // normalized email
        const publicState = ctx.op.sessionPublicState;
        if (!(publicState && publicState.resetPassword
            && publicState.resetPassword.user
            && publicState.resetPassword.user.email === claims.email
            && publicState.resetPassword.expiresAt
            && moment_1.default().isBefore(publicState.resetPassword.expiresAt))) {
            throw new error_1.ApplicationErrors.ResetPasswordSessionExpired();
        }
        const identity = await ctx.idp.findOrFail({ claims });
        await identity.updateCredentials({
            password,
            password_confirmation,
        });
        ctx.op.setSessionPublicState(prevState => ({
            ...prevState,
            resetPassword: {
                ...prevState.resetPassword,
                expiresAt: null,
            },
        }));
        return ctx.op.end();
    });
}
exports.buildResetPasswordRoutes = buildResetPasswordRoutes;
//# sourceMappingURL=reset_password.js.map
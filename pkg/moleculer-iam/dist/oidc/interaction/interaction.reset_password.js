"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const error_1 = require("../../identity/error");
const util_1 = require("./util");
exports.useResetPasswordInteraction = ({ idp, provider, router }) => {
    // 2.6. handle reset_password submit
    router.post("/reset_password/:interaction_uid", async (ctx) => {
        // 1. find interaction and check is ready to reset password
        const interaction = (await provider.Interaction.find(ctx.params.interaction_uid));
        ctx.assert(interaction && interaction.result && interaction.result.resetPassword);
        // 2. assert user with the email
        const user = await idp.findOrFail({ claims: { email: interaction.result.resetPassword.email || "" } });
        ctx.assert(user);
        // 3. validate and update credentials
        const updated = await user.updateCredentials({ password: ctx.request.body.password || "" });
        if (!updated) {
            throw new error_1.Errors.UnexpectedError("credentials has not been updated.");
        }
        // 4. forget verifyEmail state
        interaction.result.verifyEmail = null;
        await interaction.save();
        // 5. return to initial redirection
        return ctx.body = {
            interaction: {
                name: "reset_password_end",
                action: {},
                data: {
                    user: await util_1.getPublicUserProps(user),
                },
            },
        };
    });
};
//# sourceMappingURL=interaction.reset_password.js.map
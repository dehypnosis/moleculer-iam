"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const moment_1 = tslib_1.__importDefault(require("moment"));
const util_1 = require("./util");
exports.useVerifyEmailInteraction = ({ devModeEnabled, url, idp, provider, router }) => {
    // 2.5. handle verify_email submit
    const emailVerificationTimeoutSeconds = 60 * 30;
    router.post("/verify_email", async (ctx) => {
        const { client, interaction } = ctx.locals;
        ctx.assert(interaction.prompt.name === "login" || interaction.prompt.name === "consent", "Invalid Request.");
        // 2. assert user with the email
        const { callback, email } = ctx.request.body;
        const user = await idp.find({ claims: { email: email || "" } });
        if (!user) {
            ctx.throw(400, "Not a registered email address.");
        }
        // 3. check too much resend
        if (interaction && interaction.result && interaction.result.verifyEmail) {
            const old = interaction.result.verifyEmail;
            if (old.email === email && old.expiresAt && moment_1.default().isBefore(old.expiresAt)) {
                ctx.throw(400, "Cannot resend an email before previous one expires.");
            }
        }
        // 4. create code and link
        const expiresAt = moment_1.default().add(emailVerificationTimeoutSeconds, "s").toISOString();
        const payload = {
            email,
            callback,
            user: await util_1.getPublicUserProps(user),
            url: `${url("/verify_email_callback")}/${interaction.uid}`,
            expiresAt,
        };
        // TODO: 5. send email which includes (callbackURL) with adaptor props
        console.log(payload);
        // 6. extend TTL and store the state
        await interaction.save(moment_1.default().isAfter((interaction.exp / 1000) + 60 * 10, "s") ? interaction.exp + 60 * 10 : undefined);
        await provider.interactionResult(ctx.req, ctx.res, {
            ...interaction.result,
            verifyEmail: {
                callback,
                email,
                expiresAt,
            },
        }, {
            mergeWithLastSubmission: true,
        });
        // 5. render with submit, resend endpoint
        return ctx.body = {
            interaction: {
                name: "verify_email",
                action: {
                    send: {
                        url: url(`/verify_email`),
                        method: "POST",
                        data: ctx.request.body,
                    },
                },
                data: {
                    email,
                    timeoutSeconds: emailVerificationTimeoutSeconds,
                    ...(devModeEnabled ? { debug: { payload } } : {}),
                },
            },
        };
    });
    // 2.5. handle verify_email_callback link
    router.get("/verify_email_callback/:interaction_uid", async (ctx) => {
        // 1. find interaction and check expiration
        const interaction = (await provider.Interaction.find(ctx.params.interaction_uid));
        if (!interaction || !interaction.result || !interaction.result.verifyEmail || !interaction.result.verifyEmail.expiresAt || moment_1.default().isAfter(interaction.result.verifyEmail.expiresAt)) {
            ctx.throw(400, "This email verification link has expired.");
        }
        // 2. assert user with the email
        const { email, callback } = interaction.result.verifyEmail;
        const user = await idp.findOrFail({ claims: { email: email || "" } });
        // 3. update identity email_verified as true
        await user.updateClaims({ email_verified: true }, "email");
        // 4. process callback interaction
        switch (callback) {
            case "reset_password":
                // mark reset password is ready
                interaction.result.resetPassword = {
                    email,
                };
                await interaction.save();
                return ctx.body = {
                    interaction: {
                        name: "reset_password",
                        action: {
                            submit: {
                                url: url(`/reset_password/${interaction.uid}`),
                                method: "POST",
                                data: {
                                    email,
                                },
                            },
                        },
                        data: {
                            user: await util_1.getPublicUserProps(user),
                        },
                    },
                };
            default:
                ctx.throw(`Unimplemented verify_email_callback: ${callback}`);
        }
    });
};
//# sourceMappingURL=interaction.verify_email.js.map
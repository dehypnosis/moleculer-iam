"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const error_1 = require("../../identity/error");
const util_1 = require("./util");
exports.useLoginInteraction = ({ federation, provider, idp, url, render, router, parseContext }) => {
    // render login page
    router.get("/login", parseContext, async (ctx) => {
        const { user, client, interaction } = ctx.locals;
        // already signed in: login -> consent interaction
        const changeAccount = ctx.request.query.change_account === "true" || interaction.params.change_account === "true";
        const resume = !changeAccount && user && interaction.prompt.name !== "login";
        if (resume) {
            const login = {
                account: user.id,
                remember: true,
            };
            const redirect = await provider.interactionResult(ctx.req, ctx.res, {
                ...interaction.result,
                login,
            }, {
                mergeWithLastSubmission: true,
            });
            // overwrite session
            await provider.setProviderSession(ctx.req, ctx.res, login);
            return render(ctx, { redirect });
        }
        return render(ctx, {
            interaction: {
                name: "login",
                data: {
                    user: await util_1.getPublicUserProps(user),
                    client: await util_1.getPublicClientProps(client),
                    federationProviders: federation.availableProviders,
                },
                actions: {
                    "login.check_email": {
                        url: url("/login/check_email"),
                        method: "POST",
                        payload: {
                            email: "",
                        },
                    },
                    "login.check_password": {
                        url: url("/login/check_password"),
                        method: "POST",
                        payload: {
                            email: "",
                            password: "",
                        },
                    },
                    abort: {
                        url: url(`/abort`),
                        method: "POST",
                    },
                },
            },
        });
    });
    // [stateless] redirect to initial render page
    router.get("/login/:any*", ctx => {
        return render(ctx, {
            redirect: url("/login") + (ctx.search || ""),
        });
    });
    // [stateless] check login email exists
    router.post("/login/check_email", async (ctx) => {
        const { email } = ctx.request.body;
        const user = await idp.findOrFail({ claims: { email: email || "" } });
        return ctx.body = {
            user: await util_1.getPublicUserProps(user),
        };
    });
    // handle login
    router.post("/login/check_password", parseContext, async (ctx) => {
        const { interaction } = ctx.locals;
        const { email, password } = ctx.request.body;
        // check account and password
        const user = await idp.findOrFail({ claims: { email: email || "" } });
        if (!await user.assertCredentials({ password: password || "" })) {
            throw new error_1.Errors.InvalidCredentialsError();
        }
        // finish interaction and give redirection uri
        const login = {
            account: user.id,
            remember: true,
        };
        const redirect = await provider.interactionResult(ctx.req, ctx.res, {
            ...interaction.result,
            login,
        }, {
            mergeWithLastSubmission: true,
        });
        // overwrite session
        await provider.setProviderSession(ctx.req, ctx.res, login);
        return render(ctx, {
            redirect,
        });
    });
};
//# sourceMappingURL=interaction.login.js.map
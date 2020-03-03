"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const idp_1 = require("../../idp");
function buildLoginRoutes(builder, opts, actions) {
    builder.interaction.router // redirect to initial render page
        .get("/login/:any+", async (ctx) => {
        return ctx.op.render({
            redirect: ctx.op.url("/login") + (ctx.search || ""),
        });
    })
        // initial render page
        .get("/login", async (ctx) => {
        const { user, interaction, setInteractionResult, session, render, data, url } = ctx.op;
        ctx.assert(interaction);
        // already signed in and consent interaction
        if (user) {
            const changeAccount = ctx.query.change_account === "true" || interaction.params.change_account === "true";
            const resume = !changeAccount && interaction.prompt.name !== "login";
            if (resume) {
                const redirect = await setInteractionResult({
                    login: {
                        account: user.id,
                        remember: true,
                    },
                });
                return render({ redirect });
            }
            // redirect to same page with signed in user's email hint
            if (!changeAccount && data.user && data.user.email && !ctx.query.email) {
                return render({
                    redirect: url("/login") + `?email=${encodeURIComponent(data.user.email)}`,
                });
            }
        }
        return render({
            interaction: {
                name: "login",
                data,
                actions: actions.login,
            },
        });
    })
        // check login email exists
        .post("/login/check_email", async (ctx) => {
        const { email } = ctx.request.body;
        const user = await ctx.idp.findOrFail({ claims: { email: email || "" } });
        // set login data to session state and response
        const userClaims = await builder.interaction.getPublicUserProps(user);
        ctx.op.render({
            session: {
                user: userClaims,
            },
        });
    })
        // handle password login
        .post("/login/check_password", async (ctx) => {
        const { interaction, setInteractionResult, setSessionState, render } = ctx.op;
        ctx.assert(interaction);
        const { email, password } = ctx.request.body;
        // check account and password
        const user = await ctx.idp.findOrFail({ claims: { email: email || "" } });
        if (!await user.assertCredentials({ password: password || "" })) {
            throw new idp_1.Errors.InvalidCredentialsError();
        }
        // finish interaction and give redirection uri
        const redirect = await setInteractionResult({
            login: {
                account: user.id,
                remember: true,
            },
        });
        // clear login session state
        await setSessionState(prevState => ({
            ...prevState,
            login: undefined,
        }));
        return render({
            redirect,
        });
    });
}
exports.buildLoginRoutes = buildLoginRoutes;
//# sourceMappingURL=routes.login.js.map
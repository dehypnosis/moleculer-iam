"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const error_1 = require("../../identity/error");
exports.useFederationInteraction = ({ provider, router, parseContext, federation, render }) => {
    router.post("/federate", parseContext, async (ctx, next) => {
        const { interaction } = ctx.locals;
        ctx.assert(interaction.prompt.name === "login" || interaction.prompt.name === "consent", "Not a login session.");
        return federation.request(ctx.request.body.provider, ctx, next);
    });
    // handle ferderation callback
    router.get("/federate/:provider", parseContext, async (ctx, next) => {
        const { interaction } = ctx.locals;
        ctx.assert(interaction.prompt.name === "login" || interaction.prompt.name === "consent", "Not a login session.");
        const federatedUser = await federation.callback(ctx.params.provider, ctx, next);
        if (!federatedUser) {
            throw new error_1.Errors.IdentityNotExistsError();
        }
        const login = {
            account: federatedUser.id,
            remember: true,
        };
        // make user signed in
        const redirect = await provider.interactionResult(ctx.req, ctx.res, {
            ...interaction.result,
            login,
        });
        // overwrite session
        await provider.setProviderSession(ctx.req, ctx.res, login);
        return render(ctx, { redirect });
    });
};
//# sourceMappingURL=interaction.federation.js.map
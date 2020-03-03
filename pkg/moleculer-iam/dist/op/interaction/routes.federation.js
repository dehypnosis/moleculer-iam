"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const idp_1 = require("../../idp");
function buildFederationRoutes(builder, opts, actions, federation) {
    builder.interaction.router
        .post("/federate", async (ctx, next) => {
        const { interaction } = ctx.op;
        ctx.assert(interaction);
        return federation.request(ctx, next, ctx.request.body.provider);
    })
        // handle federation callback
        .get("/federate/:provider", async (ctx, next) => {
        const { interaction, setInteractionResult, render } = ctx.op;
        ctx.assert(interaction);
        const federatedUser = await federation.callback(ctx, next, ctx.params.provider);
        if (!federatedUser) {
            throw new idp_1.Errors.IdentityNotExistsError();
        }
        // make user signed in
        const redirect = await setInteractionResult({
            login: {
                account: federatedUser.id,
                remember: true,
            },
        });
        return render({ redirect });
    });
}
exports.buildFederationRoutes = buildFederationRoutes;
//# sourceMappingURL=routes.federation.js.map
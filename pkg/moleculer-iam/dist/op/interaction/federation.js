"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const idp_1 = require("../../idp");
function buildFederationRoutes(builder, opts, actions) {
    const federation = builder.interaction.federation;
    builder.interaction.router
        .post("/federate", async (ctx, next) => {
        ctx.op.assertPrompt();
        return federation.handleRequest(ctx, next, ctx.request.body.provider);
    })
        // handle federation callback
        .get("/federate/:provider", async (ctx, next) => {
        ctx.op.assertPrompt();
        const user = await federation.handleCallback(ctx, next, ctx.params.provider);
        if (!user) {
            throw new idp_1.Errors.IdentityNotExistsError();
        }
        // make user signed in
        return ctx.op.redirectWithUpdate({
            login: {
                account: user.id,
                remember: true,
            },
        });
    });
}
exports.buildFederationRoutes = buildFederationRoutes;
//# sourceMappingURL=federation.js.map
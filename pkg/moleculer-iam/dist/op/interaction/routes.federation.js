"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const idp_1 = require("../../idp");
function buildFederationRoutes(builder, opts, actions, federation) {
    builder.interaction.router
        .post("/federate", async (ctx, next) => {
        ctx.op.assertPrompt();
        return federation.request(ctx, next, ctx.request.body.provider);
    })
        // handle federation callback
        .get("/federate/:provider", async (ctx, next) => {
        ctx.op.assertPrompt();
        const user = await federation.callback(ctx, next, ctx.params.provider);
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
//# sourceMappingURL=routes.federation.js.map
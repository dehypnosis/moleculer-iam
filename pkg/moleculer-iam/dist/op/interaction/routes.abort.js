"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function buildAbortRoutes(builder, opts, actions) {
    builder.interaction.router.get("/abort", async (ctx) => {
        ctx.assert(ctx.op.interaction);
        const redirect = await ctx.op.setInteractionResult({
            error: "access_denied",
            error_description: "end-user aborted interaction.",
        });
        return ctx.op.render({ redirect });
    });
}
exports.buildAbortRoutes = buildAbortRoutes;
//# sourceMappingURL=routes.abort.js.map
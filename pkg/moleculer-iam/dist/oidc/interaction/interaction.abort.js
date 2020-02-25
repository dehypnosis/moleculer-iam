"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAbortInteraction = ({ provider, render, router, parseContext }) => {
    router.post("/abort", parseContext, async (ctx) => {
        const redirect = await provider.interactionResult(ctx.req, ctx.res, {
            error: "access_denied",
            error_description: "end-user aborted interaction",
        }, {
            mergeWithLastSubmission: false,
        });
        return render(ctx, { redirect });
    });
};
//# sourceMappingURL=interaction.abort.js.map
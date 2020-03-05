"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function buildAbortRoutes(builder, opts, actions) {
    builder.app.router.get("/abort", async (ctx) => {
        return ctx.op.redirectWithUpdate({
            error: "access_denied",
            error_description: "end-user aborted app.",
        });
    });
}
exports.buildAbortRoutes = buildAbortRoutes;
//# sourceMappingURL=abort.js.map
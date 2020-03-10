"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function buildFindEmailRoutes(builder, opts) {
    builder.app.router
        // initial render page
        .get("/find_email", async (ctx) => {
        return ctx.op.render("find_email");
    })
        // finished
        .get("/find_email/end", async (ctx) => {
        if (!ctx.op.sessionPublicState.findEmail || !ctx.op.sessionPublicState.findEmail.user) {
            return ctx.op.redirect("/find_email");
        }
        return ctx.op.render("find_email");
    });
}
exports.buildFindEmailRoutes = buildFindEmailRoutes;
//# sourceMappingURL=find_email.js.map
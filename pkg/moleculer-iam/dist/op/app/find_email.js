"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function buildFindEmailRoutes(builder, opts) {
    builder.app.router
        .get("/find_email/:any+", async (ctx) => {
        return ctx.op.redirect("/find_email" + (ctx.search || ""));
    })
        // initial render page
        .get("/find_email", async (ctx) => {
        return ctx.op.render("find_email");
    });
}
exports.buildFindEmailRoutes = buildFindEmailRoutes;
//# sourceMappingURL=find_email.js.map
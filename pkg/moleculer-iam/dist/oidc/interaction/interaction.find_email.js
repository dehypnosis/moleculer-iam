"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFindEmailInteraction = ({ url, parseContext, actions, render, router }) => {
    // [stateless] render find email
    router.get("/find_email", parseContext, async (ctx) => {
        return render(ctx, {
            interaction: {
                name: "find_email",
                actions: actions.findEmail,
            },
        });
    });
    // [stateless] redirect to initial render page
    router.get("/find_email/:any*", ctx => {
        return render(ctx, {
            redirect: url("/find_email") + (ctx.search || ""),
        });
    });
    router.post("/find_email/check_phone", ctx => {
        return render(ctx, {
            redirect: url("/find_email") + (ctx.search || ""),
        });
    });
};
//# sourceMappingURL=interaction.find_email.js.map
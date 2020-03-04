"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function buildConsentRoutes(builder, opts, actions) {
    builder.interaction.router
        .get("/consent", async (ctx) => {
        const { client, interaction } = ctx.op;
        ctx.op.assertPrompt(["consent"]);
        // skip consent if client has skip_consent property
        if (client && client.skip_consent) {
            return ctx.op.redirectWithUpdate({
                consent: {
                    rejectedScopes: [],
                    rejectedClaims: [],
                    replace: true,
                },
            });
        }
        // set consent data (scopes, claims)
        await ctx.op.setSessionState(prev => ({
            ...prev,
            consent: interaction.prompt.details,
        }));
        // or render consent form
        return ctx.op.render({
            name: "consent",
            actions: actions.consent,
        });
    })
        // handle consent
        .post("/consent/accept", async (ctx) => {
        const { interaction } = ctx.op;
        ctx.op.assertPrompt(["consent"]);
        const { rejected_scopes = [], rejected_claims = [] } = ctx.request.body;
        // clear consent data (scopes, claims)
        await ctx.op.setSessionState(prev => ({
            ...prev,
            consent: undefined,
        }));
        // finish consent interaction and give redirection uri
        return ctx.op.redirectWithUpdate({
            consent: {
                rejectedScopes: rejected_scopes,
                rejectedClaims: rejected_claims,
                replace: true,
            },
        });
    });
}
exports.buildConsentRoutes = buildConsentRoutes;
//# sourceMappingURL=routes.consent.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function buildConsentRoutes(builder, opts, actions) {
    builder.interaction.router
        .get("/consent", async (ctx) => {
        const { client, interaction, setInteractionResult, render } = ctx.op;
        ctx.assert(interaction && interaction.prompt.name === "consent");
        // skip consent if client has skip_consent property
        if (client && client.skip_consent) {
            const redirect = await setInteractionResult({
                consent: {
                    rejectedScopes: [],
                    rejectedClaims: [],
                    replace: true,
                },
            });
            return render({
                redirect,
            });
        }
        // or render consent form
        return render({
            interaction: {
                name: "consent",
                data: {
                    ...ctx.op.data,
                    // consent data (scopes, claims)
                    consent: interaction.prompt.details,
                },
                actions: actions.consent,
            },
        });
    })
        // handle consent
        .post("/consent/accept", async (ctx) => {
        const { interaction, setInteractionResult, render } = ctx.op;
        ctx.assert(interaction && interaction.prompt.name === "consent");
        const { rejected_scopes = [], rejected_claims = [] } = ctx.request.body;
        // finish consent interaction and give redirection uri
        const redirect = await setInteractionResult({
            consent: {
                rejectedScopes: rejected_scopes,
                rejectedClaims: rejected_claims,
                replace: true,
            },
        });
        return render({
            redirect,
        });
    });
}
exports.buildConsentRoutes = buildConsentRoutes;
//# sourceMappingURL=routes.consent.js.map
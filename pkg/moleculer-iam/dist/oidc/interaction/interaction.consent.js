"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("./util");
exports.useConsentInteraction = ({ provider, url, parseContext, render, router }) => {
    router.get("/consent", parseContext, async (ctx) => {
        const { user, client, interaction } = ctx.locals;
        ctx.assert(interaction.prompt.name === "consent", "Not a consent session.");
        // skip consent if client has such property
        if (client && client.skip_consent) {
            const redirect = await provider.interactionResult(ctx.req, ctx.res, {
                ...interaction.result,
                consent: {
                    rejectedScopes: [],
                    rejectedClaims: [],
                    replace: true,
                },
            }, {
                mergeWithLastSubmission: true,
            });
            return render(ctx, {
                redirect,
            });
        }
        // or render consent form
        return render(ctx, {
            interaction: {
                name: "consent",
                data: {
                    user: await util_1.getPublicUserProps(user),
                    client: await util_1.getPublicClientProps(client),
                    // consent data (scopes, claims)
                    consent: interaction.prompt.details,
                },
                actions: {
                    "consent.accept": {
                        url: url("/consent/accept"),
                        method: "POST",
                        payload: {
                            rejected_scopes: [],
                            rejected_claims: [],
                        },
                    },
                    "login": {
                        url: url("/login"),
                        method: "GET",
                        payload: {
                            change_account: "true",
                        },
                        urlencoded: true,
                    },
                    abort: {
                        url: url(`/abort`),
                        method: "POST",
                    },
                }
            },
        });
    });
    // handle consent
    router.post("/consent/accept", parseContext, async (ctx) => {
        const { user, client, interaction } = ctx.locals;
        ctx.assert(interaction.prompt.name === "consent", "Not a consent session.");
        const { rejected_scopes = [], rejected_claims = [] } = ctx.request.body;
        // finish consent interaction and give redirection uri
        const redirect = await provider.interactionResult(ctx.req, ctx.res, {
            ...interaction.result,
            consent: {
                rejectedScopes: rejected_scopes,
                rejectedClaims: rejected_claims,
                replace: true,
            },
        }, {
            mergeWithLastSubmission: true,
        });
        return render(ctx, {
            redirect,
        });
    });
};
//# sourceMappingURL=interaction.consent.js.map
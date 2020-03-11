"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const error_1 = require("./error");
function buildConsentRoutes(builder, opts) {
    builder.app.router
        .get("/consent", async (ctx) => {
        if (!ctx.op.user) {
            throw new error_1.ApplicationErrors.UnauthenticatedSession();
        }
        ctx.op.assertPrompt(["consent"]);
        // skip consent if client has skip_consent property
        const { client } = ctx.op;
        if (client && client.skip_consent) {
            return ctx.op.redirectWithUpdate({
                consent: {
                    rejectedScopes: [],
                    rejectedClaims: [],
                    replace: true,
                },
            });
        }
        // or render consent form
        return ctx.op.render("consent");
    })
        // handle consent
        .post("/consent/accept", async (ctx) => {
        if (!ctx.op.user) {
            throw new error_1.ApplicationErrors.UnauthenticatedSession();
        }
        ctx.op.assertPrompt(["consent"]);
        const { rejected_scopes = [], rejected_claims = [] } = ctx.request.body;
        // finish consent app and give redirection uri
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
//# sourceMappingURL=consent.js.map
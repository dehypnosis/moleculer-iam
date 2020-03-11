import { ProviderConfigBuilder } from "../proxy";
import { ApplicationErrors } from "./error";
import { ApplicationBuildOptions } from "./index";

export function buildConsentRoutes(builder: ProviderConfigBuilder, opts: ApplicationBuildOptions): void {
  builder.app.router
    .get("/consent", async ctx => {
      if (!ctx.op.user) {
        throw new ApplicationErrors.UnauthenticatedSession();
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
    .post("/consent/accept", async ctx => {
      if (!ctx.op.user) {
        throw new ApplicationErrors.UnauthenticatedSession();
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

import { Errors } from "../../idp";
import { ProviderConfigBuilder } from "../proxy";
import { ApplicationBuildOptions } from "./index";
import { ApplicationActionEndpointGroups } from "./actions";

export function buildFederateRoutes(builder: ProviderConfigBuilder, opts: ApplicationBuildOptions, actions: ApplicationActionEndpointGroups): void {
  const federation = builder.app.federation;
  builder.app.router
    .post("/federate", async (ctx, next) => {
      ctx.op.assertPrompt();
      ctx.assert(builder.app.federation.providerNames.includes(ctx.params.provider));
      return federation.handleRequest(ctx, next, ctx.request.body.provider);
    })

    // handle federation callback
    .get("/federate/:provider", async (ctx, next) => {
      ctx.op.assertPrompt();
      ctx.assert(builder.app.federation.providerNames.includes(ctx.params.provider));

      const user = await federation.handleCallback(ctx, next, ctx.params.provider);
      if (!user) {
        throw new Errors.IdentityNotExistsError();
      }

      // make user signed in
      return ctx.op.redirectWithUpdate({
        login: {
          account: user.id,
          remember: true,
        },
      });
    });
}

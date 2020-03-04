import { Errors } from "../../idp";
import { ProviderConfigBuilder } from "../proxy";
import { InteractionBuildOptions } from "./index";
import { InteractionActionEndpointGroups } from "./actions";

export function buildFederationRoutes(builder: ProviderConfigBuilder, opts: InteractionBuildOptions, actions: InteractionActionEndpointGroups): void {
  const federation = builder.interaction.federation;
  builder.interaction.router
    .post("/federate", async (ctx, next) => {
      ctx.op.assertPrompt();
      return federation.handleRequest(ctx, next, ctx.request.body.provider);
    })

    // handle federation callback
    .get("/federate/:provider", async (ctx, next) => {
      ctx.op.assertPrompt();

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

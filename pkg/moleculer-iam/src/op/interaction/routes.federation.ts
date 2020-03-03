import { Errors } from "../../idp";
import { ProviderConfigBuilder } from "../proxy";
import { InteractionBuildOptions } from "./bootstrap";
import { IdentityFederationManager } from "./federation";
import { InteractionActionEndpointGroups } from "./routes";

export function buildFederationRoutes(builder: ProviderConfigBuilder, opts: InteractionBuildOptions, actions: InteractionActionEndpointGroups, federation: IdentityFederationManager): void {
  builder.interaction.router
    .post("/federate", async (ctx, next) => {
      const { interaction } = ctx.op;
      ctx.assert(interaction);
      return federation.request(ctx, next, ctx.request.body.provider);
    })

    // handle federation callback
    .get("/federate/:provider", async (ctx, next) => {
      const { interaction, setInteractionResult, render } = ctx.op;
      ctx.assert(interaction);

      const federatedUser = await federation.callback(ctx, next, ctx.params.provider);
      if (!federatedUser) {
        throw new Errors.IdentityNotExistsError();
      }

      // make user signed in
      const redirect = await setInteractionResult!({
        login: {
          account: federatedUser.id,
          remember: true,
        },
      });

      return render({ redirect });
    });
}

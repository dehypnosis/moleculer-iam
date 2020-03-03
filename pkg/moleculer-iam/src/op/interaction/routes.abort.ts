import { ProviderConfigBuilder } from "../proxy";
import { InteractionBuildOptions } from "./bootstrap";
import { InteractionActionEndpointGroups } from "./routes";

export function buildAbortRoutes(builder: ProviderConfigBuilder, opts: InteractionBuildOptions, actions: InteractionActionEndpointGroups): void {
  builder.interaction.router.get("/abort", async ctx => {
    ctx.assert(ctx.op.interaction);
    const redirect = await ctx.op.setInteractionResult!({
      error: "access_denied",
      error_description: "end-user aborted interaction.",
    });
    return ctx.op.render({ redirect });
  });
}

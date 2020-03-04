import { ProviderConfigBuilder } from "../proxy";
import { InteractionBuildOptions } from "./index";
import { InteractionActionEndpointGroups } from "./actions";

export function buildAbortRoutes(builder: ProviderConfigBuilder, opts: InteractionBuildOptions, actions: InteractionActionEndpointGroups): void {
  builder.interaction.router.get("/abort", async ctx => {
    return ctx.op.redirectWithUpdate({
      error: "access_denied",
      error_description: "end-user aborted interaction.",
    });
  });
}

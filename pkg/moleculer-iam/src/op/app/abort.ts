import { ProviderConfigBuilder } from "../proxy";
import { ApplicationBuildOptions } from "./index";
import { ApplicationActionEndpointGroups } from "./actions";

export function buildAbortRoutes(builder: ProviderConfigBuilder, opts: ApplicationBuildOptions, actions: ApplicationActionEndpointGroups): void {
  builder.app.router.get("/abort", async ctx => {
    return ctx.op.redirectWithUpdate({
      error: "access_denied",
      error_description: "end-user aborted app.",
    });
  });
}

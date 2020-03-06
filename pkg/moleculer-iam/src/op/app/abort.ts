import { ProviderConfigBuilder } from "../proxy";
import { ApplicationBuildOptions } from "./index";

export function buildAbortRoutes(builder: ProviderConfigBuilder, opts: ApplicationBuildOptions): void {
  builder.app.router.get("/abort", async ctx => {
    return ctx.op.redirectWithUpdate({
      error: "access_denied",
      error_description: "end-user aborted app.",
    });
  });
}

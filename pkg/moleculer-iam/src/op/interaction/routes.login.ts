import { ProviderConfigBuilder } from "../proxy";
import { InteractionBuildOptions } from "./bootstrap";
import { InteractionActionEndpointGroups } from "./routes";

export function buildLoginRoutes(builder: ProviderConfigBuilder, opts: InteractionBuildOptions, endpoints: InteractionActionEndpointGroups): void {
  builder.interaction.router
    .get("/test", ctx => {
      return ctx.op.render({
        interaction: {
          name: "test",
          data: {
            locale: ctx.locale,
          },
        },
      })
    })
    .get("/login", async ctx => {
      await ctx.op.setSessionState({test: new Date().toISOString()});
      ctx.body = ctx.op.session;
    });
}

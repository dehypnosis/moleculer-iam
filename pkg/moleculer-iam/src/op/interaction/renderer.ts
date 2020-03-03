import * as compose from "koa-compose";
import { Logger } from "../../logger";
import { InteractionRequestContext, InteractionResponse, DiscoveryMetadata } from "../proxy";

export interface InteractionRenderer {
  routes(props: InteractionRendererProps): compose.Middleware<InteractionRequestContext>[];
  render(ctx: InteractionRequestContext, response: InteractionResponse, props: InteractionRendererProps): Promise<void>;
}

export type InteractionRendererProps = {
  logger: Logger;
  prefix: string;
  dev: boolean;
  metadata: DiscoveryMetadata;
}

export class InteractionRendererFactory {
  public static contentTypes = {
    JSON: "application/json",
    HTML: "text/html",
  };

  private readonly renderer: InteractionRenderer;

  constructor(private readonly props: InteractionRendererProps, renderer?: InteractionRenderer) {
    this.renderer = renderer || new (require("moleculer-iam-interaction-renderer").default)();
  }

  public create() {
    const { renderer, props } = this;
    return {
      routes: renderer.routes(props),
      render: async (ctx: InteractionRequestContext, res: InteractionResponse) => {
        const { JSON, HTML } = InteractionRendererFactory.contentTypes;

        // response for ajax
        if (ctx.accepts(JSON, HTML) === JSON) {
          ctx.type = JSON;
          ctx.body = res;
          return;
        }

        // response HTML
        ctx.type = HTML;
        return renderer.render(ctx, res, props);
      },
    };
  }
}

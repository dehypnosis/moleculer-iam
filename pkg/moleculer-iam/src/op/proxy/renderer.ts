import * as compose from "koa-compose";
import { Logger } from "../../logger";
import { InteractionRequestContext, InteractionResponse } from "./index";

export type InteractionPageRendererProps = {
  logger: Logger;
  prefix: string;
  dev: boolean;
}

export interface InteractionPageRenderer {
  routes?(): compose.Middleware<InteractionRequestContext>[];
  render(ctx: InteractionRequestContext, response: InteractionResponse): Promise<void>;
}

export interface InteractionPageRendererFactoryOptions {}

export type InteractionPageRendererFactory<T extends InteractionPageRendererFactoryOptions = any> = (props: InteractionPageRendererProps, options?: T) => InteractionPageRenderer;

export const dummyInteractionPageRendererFactory: InteractionPageRendererFactory = ({ logger }) => {
  logger.error(`set dummy page renderer`);

  return {
    routes() {
      return [];
    },
    async render(ctx, response) {
      ctx.body = `<html><body style="margin: 0; background: red; min-height: 100vh; padding: 5em; color: white; font-size: 1.5em; font-family: Verdana"><div><p style="font-weight: bold">Warning: Interaction page renderer not configured.</p><pre>${JSON.stringify(response, null, 2)}</pre></div></body></html>`;
    },
  };
};

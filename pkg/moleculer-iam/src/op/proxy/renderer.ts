import * as compose from "koa-compose";
import { Logger } from "../../logger";
import { InteractionState, InteractionRequestContext } from "./index";

export type InteractionStateRendererProps = {
  logger: Logger;
  prefix: string;
  dev: boolean;
}

export interface InteractionStateRenderer {
  routes?(): compose.Middleware<InteractionRequestContext>[];
  render(ctx: InteractionRequestContext, state: InteractionState): Promise<void>;
}

export interface InteractionStateRendererFactoryOptions {}

export type InteractionStateRendererFactory<T extends InteractionStateRendererFactoryOptions = any> = (props: InteractionStateRendererProps, options?: T) => InteractionStateRenderer;

export const dummyInteractionStateRendererFactory: InteractionStateRendererFactory = ({ logger }) => {
  logger.error(`set dummy interaction state renderer`);

  return {
    routes() {
      return [];
    },
    async render(ctx, state) {
      ctx.body = `<html><body style="margin: 0; background: red; min-height: 100vh; padding: 5em; color: white; font-size: 1.5em; font-family: Verdana"><div><p style="font-weight: bold">Warning: Interaction page renderer not configured.</p><pre>${JSON.stringify(state, null, 2)}</pre></div></body></html>`;
    },
  };
};

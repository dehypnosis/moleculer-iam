import Koa from "koa";
import { Logger } from "../../lib/logger";
import { ApplicationState } from "./index";

export type ApplicationRendererProps = {
  logger: Logger;
  prefix: string;
  dev: boolean;
}

// enhanced request context will be unwrapped to pure koa context before render
export interface ApplicationRenderer {
  routes?(): Koa.Middleware[];
  render(ctx: Koa.BaseContext, state: ApplicationState): Promise<void>;
}

export interface ApplicationRendererFactoryFactoryOptions {}

export type ApplicationRendererFactory<T extends ApplicationRendererFactoryFactoryOptions = any> = (props: ApplicationRendererProps, options?: T) => ApplicationRenderer;

export const dummyAppStateRendererFactory: ApplicationRendererFactory = ({ logger }) => {
  logger.error(`set dummy application renderer`);

  return {
    routes() {
      return [];
    },
    async render(ctx, state) {
      ctx.body = `<html><body style="margin: 0; background: red; min-height: 100vh; padding: 5em; color: white; font-size: 1.5em; font-family: Verdana"><div><p style="font-weight: bold">Warning: Interaction page renderer not configured.</p><pre>${JSON.stringify(state, null, 2)}</pre></div></body></html>`;
    },
  };
};

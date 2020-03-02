import { RouterContext } from "koa-router";
import * as compose from "koa-compose";
import { KoaContextWithOIDC, OIDCProviderDiscoveryMetadata } from "../provider";
import { InteractionFactoryProps } from "./interaction";

export type InteractionRendererProps = {
  adapter: InteractionRendererAdapter;
} & InteractionFactoryProps;

export interface InteractionRendererAdapter {
  routes(dev: boolean): compose.Middleware<any>[];
  render(state: InteractionRenderState, dev: boolean): string | Promise<string>;
}

export interface InteractionActionEndpoints {
  [key: string]: {
    url: string;
    method: "POST"|"GET";
    payload?: any;
    urlencoded?: boolean;
    [key: string]: any;
  };
}

export interface InteractionRenderState {
  interaction?: {
    name: string;
    data?: any;
    actions?: InteractionActionEndpoints;
  };

  // global metadata
  metadata?: OIDCProviderDiscoveryMetadata;

  // global error
  error?: {
    error: string;
    error_description?: string;
    fields?: {field: string, message: string, type: string, actual: any, expected: any}[];
    [key: string]: any;
  };

  // let client be redirected
  redirect?: string;
}

export class InteractionRenderer {
  public static contentTypes = {
    JSON: "application/json",
    HTML: "text/html",
  };

  constructor(private readonly props: InteractionRendererProps) {
  }

  public routes(): compose.Middleware<any>[] {
    return this.props.adapter!.routes(this.props.devModeEnabled);
  }

  public async render(ctx: KoaContextWithOIDC | RouterContext, state: InteractionRenderState): Promise<void> {
    const { JSON, HTML } = InteractionRenderer.contentTypes;

    // response for ajax
    if (ctx.accepts(JSON, HTML) === JSON) {
      ctx.type = JSON;
      ctx.body = state.error || state; // response error only for xhr request
      return;
    }

    // response redirection
    if (state.redirect) {
      ctx.status = 302;
      ctx.redirect(state.redirect);
      return;
    }

    // response HTML
    ctx.type = HTML;
    state.metadata = this.props.metadata; // with metadata
    ctx.body = await this.props.adapter!.render(state, this.props.devModeEnabled);
  }
}

// function loadDefaultInteractionRendererAdapter(logger: Logger): InteractionRendererAdapter<any> {
//   try {
//     // tslint:disable-next-line:no-var-requires
//     return require("moleculer-iam-interaction-renderer");
//   } catch (error) {
//     logger.error(error);
//
//     return {
//       routes() {
//         return [];
//       },
//       render(state) {
//         return `
//           <html>
//               <body>
//                   <div style="background-color:#9b0000; color: white; padding: 2em; font-family: monospace">
//                       <p>OIDC interaction renderer adapter has not been configured: can install 'moleculer-iam-interaction-renderer' or set oidc.interaction.renderer/rendererOptions option.</p>
//                       <pre>${JSON.stringify(error, null, 2)}</pre>
//                   </div>
//                   <hr>
//                   <pre>${JSON.stringify(state, null, 2)}</pre>
//               </body>
//           </html>`;
//       },
//     };
//   }
// }

/*
  should be recompiled (yarn workspace moleculer-iam-interaction-renderer build-server) on updates
  yarn build-server
*/

// @ts-ignore
import path from "path";
// @ts-ignore
import fs from "fs";
// @ts-ignore
import serveStatic from "koa-static-cache";
import { InteractionStateRendererFactory, InteractionStateRenderer, InteractionStateRendererProps } from "moleculer-iam";
import { AppOptions } from "./state";
import webpackConfig from "./config";

type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[] ? RecursivePartial<U>[] : (T[P] extends object ? RecursivePartial<T[P]> : T[P]);
};


class SinglePageInteractionRenderer implements InteractionStateRenderer {
  constructor(private readonly props: InteractionStateRendererProps, private readonly options: RecursivePartial<AppOptions> = {}) {
  }

  private views: { header: string; footer: string; } = this.loadViews();

  private loadViews() {
    // load index page and split into header and footer with app options data
    const html = fs.readFileSync(path.join(webpackConfig.output.path, "index.html")).toString();
    const index = html.indexOf("<script");

    // inject server-side options, ref ./inject.ts
    this.options.dev = this.props.dev;
    this.options.prefix = this.props.prefix;
    const options = `<script>window.__APP_OPTIONS__=${JSON.stringify(this.options)};</script>`

    return this.views = {
      header: html.substring(0, index),
      footer: options + html.substring(index),
    };
  }

  public readonly render: InteractionStateRenderer["render"] = async (ctx, state) => {
    // reload views for each rendering for development mode
    if (this.props.dev) {
      try {
        this.loadViews();
      } catch (error) {
        this.props.logger.error("failed to reload views", error);
      }
    }

    // serialize state
    let serializedState: string;
    try {
      serializedState = JSON.stringify(state);
    } catch (error) {
      this.props.logger.error("failed to stringify server state", state, error);
      serializedState = JSON.stringify({ error: { error: error.name, error_description: error.message }});
    }

    const { header, footer } = this.views!;
    ctx.body = `${header}<script>window.__APP_STATE__=${serializedState};</script>${footer}`;
  };

  public readonly routes: InteractionStateRenderer["routes"] = () => {
    return [
      // serve webpack assets
      serveStatic(webpackConfig.output.path, {
        prefix: webpackConfig.output.publicPath,
        maxAge: this.props.dev ? 0 : 60 * 60 * 24 * 7,
        dynamic: this.props.dev,
        preload: !this.props.dev,
      }),
    ];
  };
}

export = ((props, options) => {
  return new SinglePageInteractionRenderer(props, options);
}) as InteractionStateRendererFactory<RecursivePartial<AppOptions>>;

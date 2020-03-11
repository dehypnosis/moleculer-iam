/*
  should be recompiled (yarn workspace moleculer-iam-app-renderer build-server) on updates
  yarn build-server
*/

import path from "path";
import fs from "fs";
import serveStatic from "koa-static-cache";
import { ApplicationRendererFactory, ApplicationRenderer, ApplicationRendererProps } from "moleculer-iam";
import { ApplicationOptions } from "./common";
// @ts-ignore
import * as serverConfig from "./server.config";

type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[] ? RecursivePartial<U>[] : (T[P] extends object ? RecursivePartial<T[P]> : T[P]);
};


class SinglePageApplicationRenderer implements ApplicationRenderer {
  constructor(private readonly props: ApplicationRendererProps, private readonly options: RecursivePartial<ApplicationOptions> = {}) {
  }

  private views: { header: string; footer: string; } = this.loadViews();

  private loadViews() {
    // load index page and split into header and footer with app options data
    const html = fs
      .readFileSync(path.join(serverConfig.webpack.output.path, "index.html"))
      .toString()
      // "index.html" template uses "{PUBLIC_URI}" rather %PUBLIC_URL% which is for webpack itself to support assets path with dynamic prefix
      .replace(/{PUBLIC_URI}/g, serverConfig.webpack.output.publicPath);

    const index = html.indexOf("<script");

    // inject server-side options, ref ./inject.ts
    const options = `<script>window.__APP_DEV__=${JSON.stringify(this.props.dev)};window.__APP_PREFIX__=${JSON.stringify(this.props.prefix)};window.__APP_OPTIONS__=${JSON.stringify(this.options)};</script>`

    return this.views = {
      header: html.substring(0, index),
      footer: options + html.substring(index),
    };
  }

  public readonly render: ApplicationRenderer["render"] = async (ctx, state) => {
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

  public readonly routes: ApplicationRenderer["routes"] = () => {
    return [
      // serve webpack assets
      serveStatic(serverConfig.webpack.output.path, {
        prefix: serverConfig.webpack.output.publicPath,
        maxAge: this.props.dev ? 0 : 60 * 60 * 24 * 7,
        dynamic: this.props.dev,
        preload: !this.props.dev,
      }),
      (ctx, next) => {
        if (ctx.path === "/") {
          ctx.body = "<html><body><a href='/op/auth?client_id=localhost-9090&response_type=id_token&scope=openid+email&nonce=foobar&prompt=login&redirect_uri=http://localhost:9090'><h1>sign in</h1></a></body></html>";
          return;
        }
        return next();
      },
    ];
  };
}

export = ((props, options) => {
  return new SinglePageApplicationRenderer(props, options);
}) as ApplicationRendererFactory<RecursivePartial<ApplicationOptions>>;

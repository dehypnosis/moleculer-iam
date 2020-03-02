/*
  should be recompiled (yarn workspace moleculer-iam-interaction-renderer build-server) on updates
 */

// @ts-ignore
import path from "path";
// @ts-ignore
import fs from "fs";
// @ts-ignore
import serveStatic from "koa-static-cache";
import { InteractionRenderer } from "moleculer-iam";
import { ServerOptions } from "./inject";
import config from "./config";

const { output } = config;

type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[] ? RecursivePartial<U>[] : (T[P] extends object ? RecursivePartial<T[P]> : T[P]);
};

export default class DefaultInteractionRenderer implements InteractionRenderer {
  private views?: { header: string; footer: string; };
  constructor(private readonly options: RecursivePartial<ServerOptions> = {}) {
  }

  private loadViews(prefix: string) {
    const html = fs.readFileSync(path.join(output.path, "index.html")).toString();
    const index = html.indexOf("<script");

    // inject server-side options, ref ./inject.ts
    this.options.prefix = prefix;
    const options = `<script>window.__SERVER_OPTIONS__=${JSON.stringify(this.options)};</script>`

    this.views = {
      header: html.substring(0, index),
      footer: options + html.substring(index),
    };
  }

  public render: InteractionRenderer["render"] = async (ctx, state, props) => {
    // reload views for each rendering for development mode
    if (props.dev) {
      try {
        this.loadViews(props.prefix);
      } catch (error) {
        props.logger.error("failed to reload views", error);
      }
    }

    // serialize state
    let serializedState: string;
    try {
      serializedState = JSON.stringify(state);
    } catch (error) {
      props.logger.error("failed to stringify server state", state, error);
      serializedState = JSON.stringify({ error: { error: error.name, error_description: error.message }});
    }

    const { header, footer } = this.views!;
    ctx.body = `${header}<script>window.__SERVER_STATE__=${serializedState};</script>${footer}`;
  };

  public routes: InteractionRenderer["routes"] = (props) => {
    return [
      serveStatic(output.path, {
        prefix: output.publicPath,
        maxAge: props.dev ? 0 : 60 * 60 * 24 * 7,
        dynamic: props.dev,
        preload: !props.dev,
      }),
    ];
  };
}

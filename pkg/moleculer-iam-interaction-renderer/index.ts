/*
  should be recompiled (yarn workspace moleculer-iam-interaction-renderer build-server) on updates
 */

import path from "path";
import fs from "fs";
import serveStatic from "koa-static-cache";
import { InteractionRendererAdapter } from "moleculer-iam";
import { ServerOptions } from "./inject";
import config from "./config";

const { output } = config;

type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[] ? RecursivePartial<U>[] : (T[P] extends object ? RecursivePartial<T[P]> : T[P]);
};

export default class DefaultInteractionRendererAdapter implements InteractionRendererAdapter {
  private views?: { header: string; footer: string; };
  constructor(private readonly options: RecursivePartial<ServerOptions> = {}) {
    this.loadViews();
  }

  private loadViews() {
    const html = fs.readFileSync(path.join(output.path, "index.html")).toString();
    const index = html.indexOf("<script");

    // inject server-side options, ref ./src/server-state.ts
    const options = `<script>window.__SERVER_OPTIONS__=${JSON.stringify(this.options)};</script>`

    this.views = {
      header: html.substring(0, index),
      footer: options + html.substring(index),
    };
  }

  public render: InteractionRendererAdapter["render"] = (state, dev) => {
    // reload views for each rendering for development mode
    if (dev) {
      try {
        this.loadViews();
      } catch (error) {
        console.error("failed to reload views", error);
      }
    }

    // serialize state
    let serializedState: string;
    try {
      serializedState = JSON.stringify(state);
    } catch (error) {
      console.error("failed to stringify server state", state, error);
      serializedState = JSON.stringify({ error: { error: error.name, error_description: error.message }});
    }

    const { header, footer } = this.views!;
    return `${header}<script>window.__SERVER_STATE__=${serializedState};</script>${footer}`;
  };

  public routes: InteractionRendererAdapter["routes"] = (dev) => {
    return [
      serveStatic(output.path, {
        maxAge: dev ? 0 : 60 * 60 * 24 * 7,
        prefix: output.publicPath,
        dynamic: dev,
        preload: !dev,
      }),
    ];
  };
}

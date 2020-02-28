/*
  should be recompiled (yarn workspace moleculer-iam-interaction-renderer build-server) on updates
 */

import path from "path";
import fs from "fs";
import serveStatic from "koa-static-cache";
import { InteractionRendererAdapter } from "moleculer-iam";
import { ServerOptions } from "./server-state";
import config from "./config";

const { output } = config;

type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[] ? RecursivePartial<U>[] : (T[P] extends object ? RecursivePartial<T[P]> : T[P]);
};

export default class DefaultInteractionRendererAdapter implements InteractionRendererAdapter {
  private views?: { footer: string; header: string; html: string };
  constructor(private readonly options: RecursivePartial<ServerOptions> = {}) {
    this.loadViews();
  }

  private loadViews() {
    const html = fs.readFileSync(path.join(output.path, "index.html")).toString();
    const index = html.indexOf("<script");
    this.views = {
      html,
      header: html.substring(0, index),
      footer: html.substring(index),
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

    // merge partial options to state, ref ./src/server-state.ts
    (state as any).options = this.options;

    // serialize state
    let serializedState: string;
    try {
      serializedState = JSON.stringify(state);
    } catch (error) {
      console.error("failed to stringify server state", state, error);
      serializedState = JSON.stringify({ error: { error: error.name, error_description: error.message }});
    }

    const { header, footer, html } = this.views!;
    return serializedState
      ? header + `<script>window.__SERVER_STATE__=${serializedState};</script>` + footer
      : html;
  }

  public routes: InteractionRendererAdapter["routes"] = (dev) => {
    return [
      serveStatic(output.path, {
        maxAge: dev ? 0 : 60 * 60 * 24 * 7,
        prefix: output.publicPath,
        dynamic: dev,
        preload: !dev,
      }),
    ];
  }
}

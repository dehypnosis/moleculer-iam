import path from "path";
import fs from "fs";
import kleur from "kleur";
import mount from "koa-mount";
import * as _ from "lodash";
import Router, { RouterContext } from "koa-router";
import serveStatic from "koa-static";
import { Logger } from "../../logger";

export type ClientApplicationRendererProps = {
  logger: Logger;
};

export type ClientApplicationRendererOptions = {
  renderHTML?: ClientApplicationRenderHTML;
  assetsRoutePrefix?: string;
  assetsDirAbsolutePath?: string;
};

export type ClientApplicationRenderHTML = (props?: ClientApplicationProps) => Promise<string> | string;

export type ClientApplicationProps = {
  context: ClientApplicationContext,
  action?: {
    [key in string]: {
      url: string;
      method: "POST" | "GET" | "DELETE";
      data: any;
    };
  } | null;
  data?: any;
  error?: any;
};

export type ClientApplicationContext = {
  interaction_id?: string;
  account_id?: string,
  client?: {
    client_id: string,
    [key: string]: any,
  },
  prompt: {
    name: string;
    details?: any;
    reasons?: string[];
  },
  params: any;
};

const defaultAssetsPath = path.join(__dirname, "../../../dist/assets");

let defaultApp: {
  html: string,
  header: string,
  footer: string,
} | undefined;

const defaultRenderHTML: ClientApplicationRenderHTML = props => {
  if (!defaultApp) {
    const html = fs.readFileSync(path.join(defaultAssetsPath, "index.html")).toString();
    const index = html.indexOf("<script");
    defaultApp = {
      html,
      header: html.substring(0, index),
      footer: html.substring(index),
    };
  }
  return props
    ? defaultApp.header + `<script>window.OIDC=${JSON.stringify(props)};</script>` + defaultApp.footer
    : defaultApp.html;
};

export class ClientApplicationRenderer {
  private readonly renderHTML: ClientApplicationRenderHTML;
  public readonly routes?: Router.IMiddleware<any, any>;

  constructor(protected readonly props: ClientApplicationRendererProps, opts?: ClientApplicationRendererOptions) {
    const {renderHTML, assetsRoutePrefix, assetsDirAbsolutePath} = _.defaultsDeep(opts || {}, {
      renderHTML: defaultRenderHTML,
      assetsRoutePrefix: "/assets",
      assetsDirAbsolutePath: defaultAssetsPath,
    });

    this.renderHTML = renderHTML;

    if (assetsRoutePrefix && assetsDirAbsolutePath) {
      props.logger.info(`${kleur.green(assetsDirAbsolutePath)} files are being served in ${kleur.blue(assetsRoutePrefix)} for client application assets`);
      this.routes = mount(assetsRoutePrefix, serveStatic(assetsDirAbsolutePath));
    }
  }

  public async render(ctx: RouterContext, props: ClientApplicationProps|null) {
    ctx.type = "html";
    if (props) {
      const {context, action = null, data = {}, error = null} = props;
      ctx.body = await this.renderHTML({
        context,
        action,
        data,
        error,
      });
    } else {
      ctx.body = await this.renderHTML();
    }
  }
}

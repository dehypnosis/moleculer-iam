import path from "path";
import fs from "fs";
import kleur from "kleur";
import * as _ from "lodash";
import Router, { RouterContext } from "koa-router";
import serveStatic from "koa-static-cache";
import { Logger } from "../../logger";

export type ClientApplicationRendererProps = {
  logger: Logger;
};

export type ClientApplicationRendererOptions = {
  renderHTML?: ClientApplicationRenderHTML;
  assetsRoutePrefix?: string;
  assetsDirAbsolutePath?: string;
  assetsCacheMaxAge?: number;
  isValidPath?: (path: string) => Promise<boolean> | boolean;
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
  private readonly isValidPath: (path: string) => boolean | Promise<boolean>;

  constructor(protected readonly props: ClientApplicationRendererProps, opts?: ClientApplicationRendererOptions) {
    const {renderHTML, assetsRoutePrefix, assetsDirAbsolutePath, assetsCacheMaxAge} = _.defaultsDeep(opts || {}, {
      renderHTML: defaultRenderHTML,
      assetsRoutePrefix: "/assets",
      assetsDirAbsolutePath: defaultAssetsPath,
      assetsCacheMaxAge: 60 * 60 * 24 * 14,
    });

    this.renderHTML = renderHTML;
    this.isValidPath = opts && opts.isValidPath || ((p: string) => true);

    if (assetsRoutePrefix && assetsDirAbsolutePath) {
      props.logger.info(`${kleur.green(assetsDirAbsolutePath)} files are being served in ${kleur.blue(assetsRoutePrefix)} for client application assets`);
      this.routes = serveStatic(assetsDirAbsolutePath, {
        maxAge: assetsCacheMaxAge,
        prefix: assetsRoutePrefix,
        dynamic: true,
        preload: false,
      });
    }
  }

  public async render(ctx: RouterContext, props: ClientApplicationProps | null) {
    ctx.type = "html";

    // matched SPA route... response with OK code
    if (ctx.status === 404 && await this.isValidPath(ctx.path) || !props) {
      ctx.status = 200;
      ctx.body = await this.renderHTML();
    } else {
      const {context, action = null, data = {}, error = null} = props;
      ctx.body = await this.renderHTML({
        context,
        action,
        data,
        error,
      });
    }
  }
}

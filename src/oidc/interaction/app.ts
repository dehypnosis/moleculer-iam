import path from "path";
import fs from "fs";
import kleur from "kleur";
import * as _ from "lodash";
import { RouterContext } from "koa-router";
import compose from "koa-compose";
import serveStatic from "koa-static-cache";
import { Logger } from "../../logger";
import { KoaContextWithOIDC } from "../provider";
import { ClientMetadata } from "../provider/types";

export type ClientApplicationRendererProps = {
  logger: Logger;
};

export type ClientApplicationRendererOptions = {
  renderHTML?: ClientApplicationRenderHTML;
  assetsRoutePrefix?: string;
  assetsDirAbsolutePath?: string;
  assetsCacheMaxAge?: number;
  isValidPath?: (path: string) => Promise<boolean> | boolean;
  client?: Omit<ClientMetadata, "client_secret">,
};

export type ClientApplicationRenderHTML = (props?: ClientApplicationProps) => Promise<string> | string;

export interface ClientApplicationInteractionProps {
  name: string;
  action?: {
    [key in string]: {
      url: string;
      method: string;
      data?: any;
      urlencoded?: boolean;
    };
  };
  data?: any;
}

export interface ClientApplicationError {
  name: string;
  message: string;
  status?: number;
  detail?: any;
}

export type ClientApplicationProps = {
  error?: ClientApplicationError;
  interaction?: ClientApplicationInteractionProps;
  redirect?: string;
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

const contentTypes = {
  JSON: "application/json",
  HTML: "text/html",
};

export class ClientApplicationRenderer {
  public readonly router: compose.ComposedMiddleware<any>;
  private readonly renderHTML: ClientApplicationRenderHTML;
  private readonly isValidPath: (path: string) => boolean | Promise<boolean>;

  constructor(protected readonly props: ClientApplicationRendererProps, opts?: ClientApplicationRendererOptions) {
    const {renderHTML, assetsRoutePrefix, assetsDirAbsolutePath, assetsCacheMaxAge, client} = _.defaultsDeep(opts || {}, {
      renderHTML: defaultRenderHTML,
      assetsRoutePrefix: "/assets",
      assetsDirAbsolutePath: defaultAssetsPath,
      assetsCacheMaxAge: 60 * 60 * 24 * 14,
    }) as ClientApplicationRendererOptions;

    this.renderHTML = renderHTML!;
    this.isValidPath = opts && opts.isValidPath || ((p: string) => true);

    // prepare router
    const fns: Array<compose.Middleware<any>> = [];

    // serve static assets
    if (assetsRoutePrefix && assetsDirAbsolutePath) {
      props.logger.info(`${kleur.green(assetsDirAbsolutePath)} files are being served in ${kleur.blue(assetsRoutePrefix)} for client application assets`);
      fns.push(
        serveStatic(assetsDirAbsolutePath, {
          maxAge: assetsCacheMaxAge,
          prefix: assetsRoutePrefix,
          dynamic: true,
          preload: false,
        }),
      );
    }

    fns.push(async (ctx, next) => {
      await next();

      // set 404 status as 200 for matched SPA path
      if (ctx.status === 404 && await this.isValidPath(ctx.path)) {
        ctx.status = 200;
        return this.render(ctx);
      }
    });

    this.router = compose(fns);
  }

  private static normalizeError(error: any): ClientApplicationError {
    return {
      name: error.name,
      message: error.error_description || error.message,
      detail: error.error_detail || error.detail,
      status: error.status || error.statusCode || 500,
    };
  }

  public async render(ctx: RouterContext | KoaContextWithOIDC, props?: Omit<ClientApplicationProps, "error"> & { error?: any }) {
    // normalize error if have
    if (props && props.error) {
      props.error = ClientApplicationRenderer.normalizeError(props.error);
    }
    const error = props && props.error;

    // response for ajax
    if (ctx.accepts(contentTypes.JSON, contentTypes.HTML) === contentTypes.JSON) {
      ctx.type = contentTypes.JSON;
      ctx.status = error ? error.status : 200;
      return ctx.body = props || {};
    }

    // response redirection
    if (props && props.redirect) {
      ctx.status = 302;
      return ctx.redirect(props.redirect);
    }

    // response HTML (app)
    ctx.type = contentTypes.HTML;
    ctx.status = error ? error.status : 200;
    return ctx.body = await this.renderHTML(props);
  }
}

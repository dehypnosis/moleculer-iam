import * as http from "http";
import * as http2 from "http2";
import * as https from "https";
import * as kleur from "kleur";
import * as url from "url";
import Koa from "koa";
import helmet from "koa-helmet";
import { IHelmetConfiguration } from "helmet";
import prettyJSON from "koa-json";
import mount from "koa-mount";
import compose from "koa-compose";
// @ts-ignore
import redirectTrailingSlash from "koa-no-trailing-slash";
// @ts-ignore
import useLocale from "koa-locale";
import { Logger } from "../logger";
import { OIDCProvider, ParsedLocale } from "../op";
import { logging, LoggingOptions } from "./logging";

export type IAMServerProps = {
  op: OIDCProvider,
  logger?: Logger,
};

export type IAMServerOptions = {
  security?: IHelmetConfiguration,
  logging?: LoggingOptions,
  app?: (op: OIDCProvider) => Promise<compose.Middleware<any>>,
  assets?: {
    path: string;
    prefix: string;
    maxAge?: number;
  }[];

  // server configuration
  http?: {
    hostname: string,
    port?: number,
  } & http.ServerOptions,
  https?: {
    hostname: string,
    port?: number,
  } & https.ServerOptions,
  http2?: {
    hostname: string,
    port?: number,
  } & http2.ServerOptions,
  http2s?: {
    hostname: string,
    port?: number,
  } & http2.SecureServerOptions,
};

/*
  Mount OIDC Provider routes and static client application
 */
export interface IAMServerRequestContextProps {
  locale: ParsedLocale;
}

export type IAMServerRequestContext = Koa.ParameterizedContext<IAMServerRequestContextProps>;

export class IAMServer {
  private readonly logger: Logger;
  private readonly app: Koa<any, IAMServerRequestContextProps>;
  private readonly options: IAMServerOptions;

  constructor(private readonly props: IAMServerProps, opts?: IAMServerOptions) {
    const options: IAMServerOptions = this.options = opts || {};
    const { logger, op } = props;
    this.logger = logger || console;

    // create web server application
    const app = this.app = new Koa();
    app.env = op.app.env = "production";
    app.proxy = op.app.proxy = true;

    // apply middleware
    app.use(logging(this.logger, options.logging));
    app.use(redirectTrailingSlash());
    app.use(helmet(options.security));
    app.use(prettyJSON({
      pretty: true,
      spaces: 2,
    }));

    // set locale into context
    useLocale(app, "locale");
    app.use((ctx, next) => {
      // parsed by precedence of ?locale=ko-KR, Cookie: locale=ko-KR, Accept-Language: ko-KR
      // ref: https://github.com/koa-modules/locale
      // @ts-ignore
      const locale = op.parseLocale(ctx.getLocaleFromQuery() || ctx.getLocaleFromCookie() || ctx.getLocaleFromHeader());
      ctx.locale = locale;

      return next()
        .then(() => {
          // reassign locale query for redirection response
          if (ctx.headerSent || !ctx.query.locale) return;
          const redirect = ctx.response.get("Location");
          if (redirect.startsWith("/") || redirect.startsWith(op.issuer)) {
            const { protocol, auth, slashes, host, hash, query, pathname } = url.parse(redirect, true);
            query.locale = ctx.query.locale;
            ctx.response.set("Location", url.format({ protocol, auth, slashes, host, hash, query, pathname }));
          }
        });
    });
  }

  /* lifecycle */
  private http?: http.Server;
  private https?: https.Server;
  private http2?: http2.Http2Server;
  private http2s?: http2.Http2SecureServer;

  private working = false;

  public async start(): Promise<void> {
    if (this.working) {
      return;
    }

    // start op
    const { op } = this.props;
    await op.start();

    // FIXME: change extending app signature....
    // mount optional app routes and oidc provider routes
    const opRoutes = mount(op.app);
    if (this.options.app) {
      const appRoutes = await this.options.app(op);
      this.app.use(compose([appRoutes, opRoutes]));
    } else {
      this.app.use(opRoutes);
    }

    // start servers
    const config = this.options;
    const handler = this.app.callback();
    if (config.http2s) {
      const {hostname, port = 443, ...opts} = config.http2s;
      this.http2s = http2.createSecureServer(opts, handler);
      this.http2s.listen(port, hostname, undefined, this.listenCallback("http2", "https", hostname, port));
    }

    if (config.http2) {
      const {hostname, port = 8080, ...opts} = config.http2;
      this.http2 = http2.createServer(opts, handler);
      this.http2.listen(port, hostname, undefined, this.listenCallback("http2", "http", hostname, port));
    }

    if (config.https) {
      const {hostname, port = 443, ...opts} = config.https;
      this.https = https.createServer(opts, handler);
      this.https.listen(port, hostname, undefined, this.listenCallback("https", "https", hostname, port));
    }

    if (config.http || !this.https && !this.http2 && !this.http2s) {
      const {hostname, port = 8080, ...opts} = config.http || {hostname: "localhost"};
      this.http = http.createServer(opts, handler);
      this.http.listen(port, hostname, undefined, this.listenCallback("http", "http", hostname, port));
    }

    this.working = true;
    this.logger.info(`IAM server has been started`);
  }

  private listenCallback(protocol: string, scheme: string, hostname: string, port: number) {
    const { op } = this.props;
    const serverURL = kleur.blue(`${scheme}://${hostname}:${port}`);
    const discoveryURL = kleur.yellow(`${op.issuer}/.well-known/openid-configuration`);
    return () => {
      this.logger.info(`${kleur.blue(protocol.toUpperCase() + " server")} is listening\n* Web server bound to: ${serverURL}\n* OIDC discovery endpoint: ${discoveryURL}`);
    };
  }

  public async stop(): Promise<void> {
    if (!this.working) {
      return;
    }

    if (this.http) {
      this.http.close(() => this.logger.info(`http server has been stopped`));
    }
    if (this.https) {
      this.https.close(() => this.logger.info(`https server has been stopped`));
    }
    if (this.http2) {
      this.http2.close(() => this.logger.info(`http2 server has been stopped`));
    }
    if (this.http2s) {
      this.http2s.close(() => this.logger.info(`http2s server has been stopped`));
    }

    // stop op
    await this.props.op.stop();

    this.working = false;
    this.logger.info(`IAM server has been stopped`);
  }
}

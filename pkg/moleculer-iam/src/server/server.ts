import * as http from "http";
import * as http2 from "http2";
import * as https from "https";
import * as kleur from "kleur";
import Koa from "koa";
import helmet from "koa-helmet";
import { IHelmetConfiguration } from "helmet";
import prettyJSON from "koa-json";
import mount from "koa-mount";
// @ts-ignore
import locale from "koa-locale";
import { Logger } from "../logger";
import { OIDCProvider, ParsedLocale } from "../op";
import { logging, LoggingOptions } from "./logging";
import compose from "koa-compose";

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

    // apply web security and logging middleware
    app.use(logging(this.logger, options.logging));
    app.use(helmet(options.security));
    app.use(prettyJSON({
      pretty: true,
      spaces: 2,
    }));

    // set locale into context
    locale(app, "locale");
    app.use((ctx, next) => {
      // parsed by precedence of ?locale=ko-KR, Cookie: locale=ko-KR, Accept-Language: ko-KR
      // ref: https://github.com/koa-modules/locale
      // @ts-ignore
      const request = ctx.getLocaleFromQuery() || ctx.getLocaleFromCookie() || ctx.getLocaleFromHeader();
      const result = op.parseLocale(request);
      ctx.locale = result;
      return next();
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
    const discoveryURL = kleur.blue(`${scheme}://${hostname}:${port}/.well-known/openid-configuration`);
    const issuerURL = kleur.yellow(op.issuer);
    return () => {
      this.logger.info(`${kleur.blue(protocol.toUpperCase() + " server")} is listening:\n* OIDC discovery endpoint: ${discoveryURL}\n* OIDC issuer: ${issuerURL}`);
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

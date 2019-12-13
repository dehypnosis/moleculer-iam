import * as http from "http";
import * as http2 from "http2";
import * as https from "https";
import * as kleur from "kleur";
import Koa from "koa";
import helmet from "koa-helmet";
import { IHelmetConfiguration } from "helmet";
import prettyJSON from "koa-json";
import { Logger } from "../logger";
import { OIDCProvider } from "../oidc";
import { logging, LoggingOptions } from "./logging";

export type IAMServerProps = {
  oidc: OIDCProvider,
  logger?: Logger,
};

export type IAMServerOptions = {
  security?: IHelmetConfiguration,
  logging?: LoggingOptions,

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
export class IAMServer {
  private readonly logger: Logger;
  private readonly app: Koa;
  private readonly options: IAMServerOptions;

  constructor(private readonly props: IAMServerProps, opts?: IAMServerOptions) {
    const options: IAMServerOptions = this.options = opts || {};
    this.logger = props.logger || console;

    // create web server application
    const app = this.app = new Koa();
    app.env = "production";
    app.proxy = true;

    // apply middleware
    app.use(logging(this.logger, options.logging));
    app.use(helmet(options.security));
    app.use(prettyJSON({
      pretty: true,
      spaces: 2,
    }));

    // mount router
    app.use(props.oidc.router);
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
    await this.props.oidc.start();

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
      const {hostname, port = 8080, ...opts} = config.http || {hostname: "0.0.0.0"};
      this.http = http.createServer(opts, handler);
      this.http.listen(port, hostname, undefined, this.listenCallback("http", "http", hostname, port));
    }

    this.working = true;
    this.logger.info(`IAM server has been started`);
  }

  private listenCallback(protocol: string, scheme: string, hostname: string, port: number) {
    const oidc = this.props.oidc;
    const discoveryURL = kleur.blue(`${scheme}://${hostname}:${port}${oidc.discoveryPath}`);
    const issuerURL = kleur.yellow(oidc.issuer);
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
    await this.props.oidc.stop();

    this.working = false;
    this.logger.info(`IAM server has been stopped`);
  }
}

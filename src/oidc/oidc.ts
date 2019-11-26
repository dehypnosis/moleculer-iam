import * as _ from "lodash";
import * as kleur from "kleur";
import * as http from "http";
import * as http2 from "http2";
import * as https from "https";

import { Logger } from "../logger";
import { OIDCProviderBase, OIDCProviderBaseProps, OIDCProviderBaseOptions } from "./base";
import { createClientMethods } from "./methods";

export type OIDCProviderProps = {
  server?: {
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
  },
} & OIDCProviderBaseProps;

export type OIDCProviderOptions = {

  /*
   * Checkout document for configurations: https://github.com/panva/node-oidc-provider/tree/master/docs
   * default values: https://github.com/panva/node-oidc-provider/blob/master/lib/helpers/defaults.js
   */

} & OIDCProviderBaseOptions;

export class OIDCProvider {
  private readonly base: OIDCProviderBase;
  private readonly logger: Logger;
  public readonly client: ReturnType<typeof createClientMethods>;

  constructor(private readonly props: OIDCProviderProps, options?: OIDCProviderOptions) {
    const {server, ...baseProps} = props;
    const {...baseOpts} = options;
    const logger = this.logger = props.logger || console;

    /* create OIDCProviderBase */
    const base = this.base = new OIDCProviderBase(baseProps, baseOpts);

    /* create methods */
    this.client = createClientMethods(base);
  }

  /* lifecycle */
  private http?: http.Server;
  private https?: https.Server;
  private http2?: http2.Http2Server;
  private http2s?: http2.Http2SecureServer;

  public async start(): Promise<void> {
    // start OIDC provider base
    await this.base.start();

    // start servers
    const config = this.props.server || {};
    const handler = this.base.httpRequestHandler;
    if (config.http2s) {
      const {hostname, port = 443, ...opts} = config.http2s;
      this.http2s = http2.createSecureServer(opts, handler);
      this.http2s.listen(port, hostname, undefined, () => {
        this.logger.info(`OIDC provider http2s server listening to ${kleur.blue(`https://${hostname}:${port}`)}`);
      });
    }

    if (config.http2) {
      const {hostname, port = 8080, ...opts} = config.http2;
      this.http2 = http2.createServer(opts, handler);
      this.http2.listen(port, hostname, undefined, () => {
        this.logger.info(`OIDC provider http2 server listening to ${kleur.blue(`http://${hostname}:${port}`)}`);
      });
    }

    if (config.https) {
      const {hostname, port = 443, ...opts} = config.https;
      this.https = https.createServer(opts, handler);
      this.https.listen(port, hostname, undefined, () => {
        this.logger.info(`OIDC provider https server listening to ${kleur.blue(`https://${hostname}:${port}`)}`);
      });
    }

    if (config.http || !this.https && !this.http2 && !this.http2s) {
      const {hostname, port = 8080, ...opts} = config.http || {hostname: "0.0.0.0"};
      this.http = http.createServer(opts, handler);
      this.http.listen(port, hostname, undefined, () => {
        this.logger.info(`OIDC provider http server listening to ${kleur.blue(`http://${hostname}:${port}`)}`);
      });
    }

    this.logger.info(`OIDC provider has been started`);
  }

  public async stop(): Promise<void> {
    if (this.http) {
      this.http.close(() => this.logger.info(`OIDC provider http server has been stopped`));
    }
    if (this.https) {
      this.https.close(() => this.logger.info(`OIDC provider https server has been stopped`));
    }
    if (this.http2) {
      this.http2.close(() => this.logger.info(`OIDC provider http2 server has been stopped`));
    }
    if (this.http2s) {
      this.http2s.close(() => this.logger.info(`OIDC provider http2s server has been stopped`));
    }

    // stop OIDC provider base
    await this.base.stop();

    this.logger.info(`OIDC provider has been stopped`);
  }
}

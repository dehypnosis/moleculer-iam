import { Provider, Configuration } from "oidc-provider";

export { ClientMetadata } from "oidc-provider";
import { Logger } from "./logger";
import * as _ from "lodash";
import * as http from "http";
import * as http2 from "http2";
import * as https from "https";
// @ts-ignore
import instance from "oidc-provider/lib/helpers/weak_cache";

export type OIDCProviderProps = {
  logger?: Logger,
  issuer: string,
  trustProxy?: boolean,
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
 * Checkout document for configurations: https://github.com/panva/node-oidc-provider/tree/master/docs
 * Library default values: https://github.com/panva/node-oidc-provider/blob/master/lib/helpers/defaults.js
 */
export type OIDCProviderOptions = Configuration;

export class OIDCProvider {
  private readonly provider: Provider;
  private readonly logger: Logger;

  private static defaultOptions: OIDCProviderOptions = {
    features: {
      devInteractions: {enabled: false},
      encryption: {enabled: true},
      introspection: {enabled: true},
      revocation: {enabled: true},
      backchannelLogout: {enabled: true},
      frontchannelLogout: {enabled: true},
      sessionManagement: {enabled: true},
      webMessageResponseMode: {enabled: true},
      registration: {enabled:false},
      registrationManagement: {enabled:false},
    },
    formats: {
      AccessToken: "jwt",
    },
    // TODO: checkout utilizable methods
    // TODO: where should account management go?
    // TODO: views....... as SPA? or... how to? should separate them all?
    // TODO: dynamic clients management
    // TODO: dynamic claims schema management
    // TODO: group support?
    renderError(ctx, out, error) {
      ctx.type = "json";
      // @ts-ignore
      ctx.status = error.status || error.statusCode || 500;
      ctx.body = out;
    },
  };

  constructor(private readonly props: OIDCProviderProps, opts?: OIDCProviderOptions) {
    const {issuer, logger, trustProxy} = props;
    // set logger
    this.logger = logger || console;

    // create OIDC provider
    const options: OIDCProviderOptions = _.defaultsDeep(opts || {}, OIDCProvider.defaultOptions);
    const provider = this.provider = new Provider(issuer, options);
    provider.proxy = trustProxy !== false;

    // apply debug options
    if (issuer.startsWith("http://")) {
      const warn = this.logger.warn;
      // @ts-ignore
      const invalidate = provider.Client.Schema.prototype.invalidate;
      // @ts-ignore
      provider.Client.Schema.prototype.invalidate = function(message: any, code: string) {
        if (code === "implicit-force-https" || code === "implicit-forbid-localhost") {
          warn(`${code} error for client schema validation ignored for debugging purpose`);
          return;
        }
        invalidate.call(this, message);
      };
    }
  }

  private http?: http.Server;
  private https?: https.Server;
  private http2?: http2.Http2Server;
  private http2s?: http2.Http2SecureServer;

  public start(): void {
    instance(this.provider).app.mountpath = "/test";

    if (this.props.http2s) {
      const {hostname, port = 443, ...opts} = this.props.http2s;
      this.http2s = http2.createSecureServer(opts, this.provider.callback);
      this.http2s.listen(port, hostname, undefined, () => {
        this.logger.info(`OIDC provider http2s server listening to https://${hostname}:${port}`);
      });
    }

    if (this.props.http2) {
      const {hostname, port = 8080, ...opts} = this.props.http2;
      this.http2 = http2.createServer(opts, this.provider.callback);
      this.http2.listen(port, hostname, undefined, () => {
        this.logger.info(`OIDC provider http2 server listening to http://${hostname}:${port}`);
      });
    }

    if (this.props.https) {
      const {hostname, port = 443, ...opts} = this.props.https;
      this.https = https.createServer(opts, this.provider.callback);
      this.https.listen(port, hostname, undefined, () => {
        this.logger.info(`OIDC provider https server listening to https://${hostname}:${port}`);
      });
    }

    if (this.props.http || !this.https && !this.http2 && !this.http2s) {
      const {hostname, port = 8080, ...opts} = this.props.http || {hostname: "0.0.0.0"};
      this.http = http.createServer(opts, this.provider.callback);
      this.http.listen(port, hostname, undefined, () => {
        this.logger.info(`OIDC provider http server listening to http://${hostname}:${port}`);
      });
    }
  }

  public async addClient(param: { grant_types: string[]; logo_uri: string; redirect_uris: string[]; client_id: string; token_endpoint_auth_method: string; response_types: string[] }) {
    await instance(this.provider).clientRemove(param);
    console.log(await instance(this.provider).clientAdd(param));
  }
}

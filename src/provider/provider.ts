import * as _ from "lodash";
import * as kleur from "kleur";
import * as http from "http";
import * as http2 from "http2";
import * as https from "https";

import { Logger } from "../logger";
import { Provider, ClientMetadata, Client, errors as OIDCErrors } from "oidc-provider";
import "./typings"; // extend oidc-provider types
import { defaultOIDCProviderOptions, OIDCProviderOptions } from "./options";
import { extendOIDCProvider } from "./extensions";

export { ClientMetadata, Client, errors as OIDCErrors } from "oidc-provider";
export { OIDCProviderOptions } from "./options";

// need to hack oidc-provider private methods
// @ts-ignore
import getProviderProps from "oidc-provider/lib/helpers/weak_cache";

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

export class OIDCProvider {
  private readonly provider: Provider;
  private readonly providerProps: any;
  private readonly logger: Logger;
  private static defaultOptions: OIDCProviderOptions = defaultOIDCProviderOptions;

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
      extendOIDCProvider(provider, this.logger, {
        "disable-implicit-forbid-localhost": true,
        "disable-implicit-force-https": true,
      });
    }

    // get hidden property map of provider instance
    this.providerProps = getProviderProps(provider);
  }

  /* mount/unmount servers */
  private http?: http.Server;
  private https?: https.Server;
  private http2?: http2.Http2Server;
  private http2s?: http2.Http2SecureServer;

  private working: boolean = false;

  public start(): void {
    if (this.working) {
      return;
    }
    this.working = true;

    if (this.props.http2s) {
      const {hostname, port = 443, ...opts} = this.props.http2s;
      this.http2s = http2.createSecureServer(opts, this.provider.callback);
      this.http2s.listen(port, hostname, undefined, () => {
        this.logger.info(`OIDC provider http2s server listening to ${kleur.blue(`https://${hostname}:${port}`)}`);
      });
    }

    if (this.props.http2) {
      const {hostname, port = 8080, ...opts} = this.props.http2;
      this.http2 = http2.createServer(opts, this.provider.callback);
      this.http2.listen(port, hostname, undefined, () => {
        this.logger.info(`OIDC provider http2 server listening to ${kleur.blue(`http://${hostname}:${port}`)}`);
      });
    }

    if (this.props.https) {
      const {hostname, port = 443, ...opts} = this.props.https;
      this.https = https.createServer(opts, this.provider.callback);
      this.https.listen(port, hostname, undefined, () => {
        this.logger.info(`OIDC provider https server listening to ${kleur.blue(`https://${hostname}:${port}`)}`);
      });
    }

    if (this.props.http || !this.https && !this.http2 && !this.http2s) {
      const {hostname, port = 8080, ...opts} = this.props.http || {hostname: "0.0.0.0"};
      this.http = http.createServer(opts, this.provider.callback);
      this.http.listen(port, hostname, undefined, () => {
        this.logger.info(`OIDC provider http server listening to ${kleur.blue(`http://${hostname}:${port}`)}`);
      });
    }

    this.logger.info(`OIDC provider has been started`);
  }

  public stop(): void {
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

    this.logger.info(`OIDC provider has been stopped`);
    this.working = false;
  }

  /* client management */
  public async findClient(id: string): Promise<Client | null> {
    const client = await this.providerProps.Client.find(id) as (Client | undefined);
    return client || null;
  }

  public async findClientOrFail(id: string) {
    const client = await this.findClient(id);
    if (!client) {
      throw new OIDCErrors.InvalidClient("client not found");
    }
    return client;
  }

  public async createClient(metadata: ClientMetadata): Promise<Client> {
    this.logger.info(`create client ${kleur.cyan(metadata.client_id)}:`, metadata);
    if (metadata.client_id && await this.findClient(metadata.client_id)) {
      throw new OIDCErrors.InvalidClient("client_id is duplicated");
    }
    return await this.providerProps.clientAdd(metadata, {store: true}) as Client;
  }

  public async updateClient(metadata: ClientMetadata): Promise<Client> {
    this.logger.info(`update client ${kleur.cyan(metadata.client_id || "<unknown>")}:`, metadata);
    await this.findClient(metadata.client_id);
    return await this.providerProps.clientAdd(metadata, {store: true}) as Client;
  }

  public async removeClient(id: string): Promise<void> {
    this.logger.info(`remove client ${kleur.cyan(id)}`);
    await this.findClient(id);
    return this.providerProps.clientRemove(id);
  }
}

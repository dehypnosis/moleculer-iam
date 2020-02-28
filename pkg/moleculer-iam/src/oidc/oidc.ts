import { Logger } from "../logger";
import { OIDCProviderProxy, OIDCProviderProxyOptions, OIDCProviderProxyProps } from "./proxy/proxy";

export { OIDCModelNames } from "./proxy/adapter/model";

export type OIDCProviderProps = {
  logger: Logger;
} & OIDCProviderProxyProps;

export type OIDCProviderOptions = OIDCProviderProxyOptions;

// merge proxy props to type
// @ts-ignore
export interface OIDCProvider extends OIDCProviderProxy {
}

export class OIDCProvider {
  private readonly logger: Logger;
  private readonly proxy: OIDCProviderProxy;

  constructor(private readonly props: OIDCProviderProps, options: OIDCProviderOptions) {
    this.logger = props.logger;

    // create proxy
    const proxy = this.proxy = new OIDCProviderProxy(props, options);;

    // assign proxy props to this instance
    return new Proxy(this, {
      get(target, prop: keyof OIDCProvider & keyof OIDCProviderProxy) {
        return target[prop] || proxy[prop];
      },
    });
  }

  /* lifecycle */
  private working = false;

  public async start(): Promise<void> {
    if (this.working) {
      return;
    }

    // start proxy
    await this.proxy.adapter.start();

    this.working = true;
    this.logger.info(`oidc provider has been started`);
  }

  public async stop(): Promise<void> {
    if (!this.working) {
      return;
    }

    // stop proxy
    await this.proxy.adapter.stop();

    this.working = false;
    this.logger.info(`oidc provider has been stopped`);
  }
}

import { IdentityProvider } from "../idp";
import { Logger } from "../lib/logger";
import { OIDCModelNames, OIDCVolatileModelNames, OIDCProviderProxy, OIDCProviderProxyOptions, ClientMetadata, OIDCErrors } from "./proxy";

export type OIDCProviderProps = {
  logger: Logger;
  idp: IdentityProvider;
};

export type OIDCProviderOptions = OIDCProviderProxyOptions;

// merge proxy props to type
// @ts-ignore
export interface OIDCProvider extends OIDCProviderProxy {
}

export class OIDCProvider {
  public static modelNames = OIDCModelNames;
  public static volatileModelNames = OIDCVolatileModelNames;

  private readonly logger: Logger;
  private readonly idp: IdentityProvider;
  private readonly proxy: OIDCProviderProxy;

  constructor(private readonly props: OIDCProviderProps, options: OIDCProviderOptions) {
    const {logger = console, idp} = this.props;
    this.logger = logger;
    this.idp = idp;

    // create proxy
    const proxy = this.proxy = new OIDCProviderProxy({
      logger,
      idp,
    }, options);

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

    // start idp
    await this.props.idp.start();

    // start proxy
    await this.proxy.start();

    this.working = true;
    this.logger.info(`oidc provider has been started`);
  }

  public async stop(): Promise<void> {
    if (!this.working) {
      return;
    }

    // stop idp
    await this.idp.stop();

    // stop proxy
    await this.proxy.stop();

    this.working = false;
    this.logger.info(`oidc provider has been stopped`);
  }
}

import * as _ from "lodash";
import { Provider } from "oidc-provider";
import { IdentityProvider } from "../../identity";
import { Logger } from "../../logger";
import { OIDCAdapterProxy, OIDCAdapterProxyConstructorOptions, OIDCAdapterProxyConstructors } from "./adapter";
import { OIDCModelNames } from "./adapter/model";
import { getProviderAndProxyConfiguration, ProxyConfiguration, StaticConfiguration } from "./config";

export type OIDCProviderProxyProps = {
  logger: Logger;
  idp: IdentityProvider;
};

export type OIDCProviderProxyOptions = {
  adapter?: OIDCAdapterProxyConstructorOptions;
  interaction?: any; // TODO
} & StaticConfiguration;

export class OIDCProviderProxy {
  private readonly logger: Logger;
  private readonly provider: Provider;
  private readonly config: ProxyConfiguration;
  public readonly adapter: OIDCAdapterProxy;

  constructor(private readonly props: OIDCProviderProxyProps, options: OIDCProviderProxyOptions) {
    const logger = this.logger = props.logger;
    const { adapter, ...staticConfig } = options;

    // apply static options and get the provider instance and proxy config which can be set dynamically
    const { provider, config } = getProviderAndProxyConfiguration({
      logger,
    }, staticConfig);
    this.provider = provider;
    this.config = config;

    // create adapter
    const adapterOptions: OIDCAdapterProxyConstructorOptions = _.defaultsDeep(adapter, {
      type: "Memory",
      options: {},
    });

    const adapterKey: keyof (typeof OIDCAdapterProxyConstructors) = Object.keys(OIDCAdapterProxyConstructors).find(k => k.toLowerCase() === adapterOptions.type.toLowerCase())
      || Object.keys(OIDCAdapterProxyConstructors)[0] as any;

    this.adapter = new OIDCAdapterProxyConstructors[adapterKey]({
      logger,
    }, adapterOptions.options);

    // and dynamically set to provider option
    config.adapter = this.adapter.adapterConstructorProxy;
  }

  // regular props
  public get issuer() {
    return this.provider.issuer;
  }

  // TODO: ... routes first
  public get routes() {
    return (ctx: any, next: any) => {
      return next();
    }
  }

  public readonly modelNames = OIDCModelNames;

  // programmable props
  public deleteModels(...args: any[]): any {}
  public countModels(...args: any[]): any {
    return 10;
  }
  // set available scopes and claims dynamically
  public async syncSupportedClaimsAndScopes(): Promise<void> {
  }
}

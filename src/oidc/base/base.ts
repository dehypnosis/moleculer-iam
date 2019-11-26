import * as _ from "lodash";
import { Logger } from "../../logger";
import { OIDCModelName, OIDCModelPayload, Provider as OriginalProvider } from "./types";
import { OIDCAdapter, OIDCAdapterConstructors, OIDCAdapterConstructorOptions, OIDCModel } from "../adapter";
import { defaultOIDCProviderBaseOptions, OIDCProviderBaseOptions } from "./options";
import { applyDebugOptions } from "./debug";

// @ts-ignore : need to hack oidc-provider private methods
import getOriginalProviderHiddenMap from "oidc-provider/lib/helpers/weak_cache";

export type OIDCProviderBaseProps = {
  issuer: string,
  adapter?: OIDCAdapterConstructorOptions,
  logger?: Logger,
  trustProxy?: boolean,
};

export class OIDCProviderBase {
  public readonly logger: Logger;
  private readonly adapter: OIDCAdapter;
  public readonly original: OriginalProvider;
  public readonly originalMap: any;

  constructor(private readonly props: OIDCProviderBaseProps, options?: OIDCProviderBaseOptions) {
    const {issuer, trustProxy} = props;
    const logger = this.logger = props.logger || console;

    /* create adapter */
    const adapterConfig: OIDCProviderBaseProps["adapter"] = _.defaultsDeep(props.adapter || {}, {
      type: "Memory",
      options: {},
    });
    const adapterKey: keyof (typeof OIDCAdapterConstructors) = Object.keys(OIDCAdapterConstructors).find(k => k.toLowerCase() === adapterConfig!.type.toLowerCase())
      || Object.keys(OIDCAdapterConstructors)[0] as any;
    this.adapter = new OIDCAdapterConstructors[adapterKey]({
      logger,
    }, adapterConfig!.options);

    /* create original provider */
    options = _.defaultsDeep(options || {}, defaultOIDCProviderBaseOptions);
    const original = this.original = new OriginalProvider(issuer, {
      ...options,
      adapter: this.adapter.originalAdapterProxy,
      // TODO: findAccount: ...
    });
    original.proxy = trustProxy !== false;

    // apply debugging features
    if (issuer.startsWith("http://")) {
      applyDebugOptions(original, logger, {
        "disable-implicit-forbid-localhost": true,
        "disable-implicit-force-https": true,
      });
    }

    // get hidden map of provider instance which contains private properties
    this.originalMap = getOriginalProviderHiddenMap(original);
  }

  public getModel<T extends OIDCModelPayload = OIDCModelPayload>(name: OIDCModelName): OIDCModel<T> {
    return this.adapter.getModel(name);
  }

  /* will be used by http servers */
  public get httpRequestHandler() {
    return this.original.callback;
  }

  /* lifecycle */
  public async start(): Promise<void> {
    // start adapter
    await this.adapter.start();
  }

  public async stop(): Promise<void> {
    // stop adapter
    await this.adapter.stop();
  }
}

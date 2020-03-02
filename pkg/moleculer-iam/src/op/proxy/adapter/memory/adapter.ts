import LRUCache from "lru-cache";
import { OIDCModelProxyProps } from "../model";
import { OIDCAdapterProxy, OIDCAdapterProxyProps } from "../adapter";
import { OIDCMemoryModelProxy } from "./model";

export type OIDCMemoryAdapterProxyOptions = LRUCache.Options<string, any>;

// tslint:disable-next-line:class-name
export class OIDCMemoryAdapterProxy extends OIDCAdapterProxy {
  public readonly displayName = "Memory";

  constructor(protected readonly props: OIDCAdapterProxyProps, protected readonly options?: OIDCMemoryAdapterProxyOptions) {
    super(props);
  }

  protected createModel(props: OIDCModelProxyProps): OIDCMemoryModelProxy {
    return new OIDCMemoryModelProxy(props, new LRUCache<string, any>(this.options)) as OIDCMemoryModelProxy;
  }
}

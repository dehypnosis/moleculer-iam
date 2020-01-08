import * as LRUCacheConstructor from "lru-cache";
import LRUCache from "lru-cache";
import { OIDCAdapter, OIDCAdapterProps } from "../adapter";
import { OIDCModelName, OIDCModelPayload } from "../model";
import { OIDCMemoryModel } from "./model";

export type OIDC_MemoryAdapterOptions = LRUCache.Options<string, any>;

// tslint:disable-next-line:class-name
export class OIDC_MemoryAdapter extends OIDCAdapter {
  public readonly displayName = "Memory";

  constructor(protected readonly props: OIDCAdapterProps, protected readonly options?: OIDC_MemoryAdapterOptions) {
    super(props);
  }

  protected createModel<T extends OIDCModelPayload>(name: OIDCModelName): OIDCMemoryModel<T> {
    return new OIDCMemoryModel({
      name,
      logger: this.logger,
    }, new LRUCache<string, any>(this.options)) as OIDCMemoryModel<T>;
  }
}

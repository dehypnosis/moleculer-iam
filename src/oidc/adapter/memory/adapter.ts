import * as LRUCacheConstructor from "lru-cache";
import LRUCache from "lru-cache";
import { OIDCAdapter, OIDCAdapterProps } from "../adapter";
import { OIDCModelName, OIDCModelPayload } from "../model";
import { OIDCMemoryModel } from "./model";

export type OIDC_MemoryAdapterOptions = LRUCache.Options<string, any>;

// tslint:disable-next-line:class-name
export class OIDC_MemoryAdapter extends OIDCAdapter {
  private readonly storage: LRUCache<string, any>;
  public readonly displayName = "Memory";

  constructor(protected readonly props: OIDCAdapterProps, options?: OIDC_MemoryAdapterOptions) {
    super(props);
    this.storage = new LRUCache<string, any>(options);
  }

  protected createModel<T extends OIDCModelPayload>(name: OIDCModelName): OIDCMemoryModel<T> {
    return new OIDCMemoryModel({
      name,
      logger: this.logger,
    }, this.storage) as OIDCMemoryModel<T>;
  }
}

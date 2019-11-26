import * as LRUCacheConstructor from "lru-cache";
import LRUCache from "lru-cache";
import { OIDCAdapter, OIDCAdapterProps } from "../adapter";
import { OIDCModelName, OIDCModelPayload } from "../model";
import { OIDCMemoryModel } from "./model";

export type OIDCMemoryAdapterOptions = LRUCache.Options<string, any>;

export class OIDCMemoryAdapter extends OIDCAdapter {
  private readonly storage: LRUCache<string, any>;

  constructor(protected readonly props: OIDCAdapterProps, options?: OIDCMemoryAdapterOptions) {
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

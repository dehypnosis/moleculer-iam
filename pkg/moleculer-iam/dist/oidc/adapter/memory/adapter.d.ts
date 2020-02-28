import * as LRUCacheConstructor from "lru-cache";
import LRUCache from "lru-cache";
import { OIDCAdapter, OIDCAdapterProps } from "../adapter";
import { OIDCModelName, OIDCModelPayload } from "../model";
import { OIDCMemoryModel } from "./model";
export declare type OIDC_MemoryAdapterOptions = LRUCache.Options<string, any>;
export declare class OIDC_MemoryAdapter extends OIDCAdapter {
    protected readonly props: OIDCAdapterProps;
    protected readonly options?: LRUCacheConstructor.Options<string, any> | undefined;
    readonly displayName = "Memory";
    constructor(props: OIDCAdapterProps, options?: LRUCacheConstructor.Options<string, any> | undefined);
    protected createModel<T extends OIDCModelPayload>(name: OIDCModelName): OIDCMemoryModel<T>;
}

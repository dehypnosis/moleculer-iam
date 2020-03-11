import LRUCache from "lru-cache";
import { OIDCModelProxyProps } from "../model";
import { OIDCAdapterProxy, OIDCAdapterProxyProps } from "../adapter";
import { OIDCMemoryModelProxy } from "./model";
export declare type OIDCMemoryAdapterProxyOptions = LRUCache.Options<string, any>;
export declare class OIDCMemoryAdapterProxy extends OIDCAdapterProxy {
    protected readonly props: OIDCAdapterProxyProps;
    protected readonly options?: LRUCache.Options<string, any> | undefined;
    readonly displayName = "Memory";
    constructor(props: OIDCAdapterProxyProps, options?: LRUCache.Options<string, any> | undefined);
    protected createModel(props: OIDCModelProxyProps): OIDCMemoryModelProxy;
}

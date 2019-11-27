import LRUCache from "lru-cache";
import { OIDCAdapter, OIDCAdapterProps } from "../adapter";
import { OIDCModelName, OIDCModelPayload } from "../model";
import { OIDCMemoryModel } from "./model";
export declare type OIDCMemoryAdapterOptions = LRUCache.Options<string, any>;
export declare class OIDCMemoryAdapter extends OIDCAdapter {
    protected readonly props: OIDCAdapterProps;
    private readonly storage;
    constructor(props: OIDCAdapterProps, options?: OIDCMemoryAdapterOptions);
    protected createModel<T extends OIDCModelPayload>(name: OIDCModelName): OIDCMemoryModel<T>;
}

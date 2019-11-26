import { OIDCModelAdapter, OIDCModelPayload, OIDCModelAdapterProps } from "./adapter";
import LRUCache from "lru-cache";
export declare type OIDCModelMemoryAdapterOptions = LRUCache.Options<string, any>;
export declare class OIDCModelMemoryAdapter<M extends OIDCModelPayload = OIDCModelPayload> extends OIDCModelAdapter<M> {
    protected readonly props: OIDCModelAdapterProps;
    private static grantKeyFor;
    private static sessionUidKeyFor;
    private static userCodeKeyFor;
    private readonly storage;
    constructor(props: OIDCModelAdapterProps, options?: OIDCModelMemoryAdapterOptions);
    consume(id: string): Promise<void>;
    destroy(id: string): Promise<void>;
    find(id: string): Promise<M | void>;
    get(opts?: {
        offset?: number;
        limit?: number;
    }): Promise<M[]>;
    count(): Promise<number>;
    findByUid(uid: string): Promise<M | void>;
    findByUserCode(userCode: string): Promise<M | void>;
    revokeByGrantId(grantId: string): Promise<void>;
    upsert(id: string, data: M, expiresIn: number): Promise<void>;
}

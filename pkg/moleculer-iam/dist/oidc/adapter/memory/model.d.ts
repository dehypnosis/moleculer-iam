import LRUCache from "lru-cache";
import { OIDCModel, OIDCModelPayload, OIDCModelProps } from "../model";
export declare class OIDCMemoryModel<M extends OIDCModelPayload = OIDCModelPayload> extends OIDCModel<M> {
    protected readonly props: OIDCModelProps;
    private readonly storage;
    constructor(props: OIDCModelProps, storage: LRUCache<string, any>);
    consume(id: string): Promise<void>;
    delete(): Promise<number>;
    destroy(id: string): Promise<void>;
    find(id: string): Promise<M | undefined>;
    get(args?: {
        offset?: number;
        limit?: number;
    }): Promise<M[]>;
    count(args?: any): Promise<number>;
    findByUid(uid: string): Promise<M | undefined>;
    findByUserCode(userCode: string): Promise<M | undefined>;
    revokeByGrantId(grantId: string): Promise<void>;
    upsert(id: string, data: M, expiresIn: number): Promise<void>;
}

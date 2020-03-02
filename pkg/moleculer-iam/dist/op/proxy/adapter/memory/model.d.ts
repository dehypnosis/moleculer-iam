import LRUCache from "lru-cache";
import { AdapterPayload } from "oidc-provider";
import { OIDCModelProxy, OIDCModelProxyProps } from "../model";
export declare class OIDCMemoryModelProxy extends OIDCModelProxy {
    protected readonly props: OIDCModelProxyProps;
    private readonly storage;
    constructor(props: OIDCModelProxyProps, storage: LRUCache<string, any>);
    consume(id: string): Promise<void>;
    delete(): Promise<number>;
    destroy(id: string): Promise<void>;
    find(id: string): Promise<AdapterPayload | undefined>;
    get(args?: {
        offset?: number;
        limit?: number;
    }): Promise<AdapterPayload[]>;
    count(args?: any): Promise<number>;
    findByUid(uid: string): Promise<AdapterPayload>;
    findByUserCode(userCode: string): Promise<AdapterPayload>;
    revokeByGrantId(grantId: string): Promise<void>;
    upsert(id: string, data: AdapterPayload, expiresIn: number): Promise<void>;
}

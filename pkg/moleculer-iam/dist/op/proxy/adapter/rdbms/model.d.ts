import { AdapterPayload } from "oidc-provider";
import { ModelClass, FindOptions, WhereAttributeHash } from "../../../../helper/rdbms";
import { OIDCModelProxyProps, OIDCModelProxy } from "../model";
export declare class OIDCRDBMSModelProxy extends OIDCModelProxy {
    protected readonly props: OIDCModelProxyProps;
    private readonly model;
    constructor(props: OIDCModelProxyProps, model: ModelClass);
    consume(id: string): Promise<void>;
    destroy(id: string): Promise<void>;
    find(id: string): Promise<AdapterPayload | undefined>;
    findByUid(uid: string): Promise<AdapterPayload>;
    findByUserCode(userCode: string): Promise<AdapterPayload>;
    get(args?: FindOptions): Promise<AdapterPayload[]>;
    delete(args?: FindOptions): Promise<number>;
    count(args?: WhereAttributeHash): Promise<number>;
    revokeByGrantId(grantId: string): Promise<void>;
    upsert(id: string, data: AdapterPayload, expiresIn: number): Promise<void>;
    private getEntryData;
}

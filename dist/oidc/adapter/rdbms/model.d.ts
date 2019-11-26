import { ModelClass, FindOptions } from "../../../helper/rdbms";
import { OIDCModel, OIDCModelPayload, OIDCModelProps } from "../model";
export declare class OIDC_RDBMS_Model<M extends OIDCModelPayload = OIDCModelPayload> extends OIDCModel<M> {
    protected readonly props: OIDCModelProps;
    private readonly model;
    constructor(props: OIDCModelProps, model: ModelClass);
    consume(id: string): Promise<void>;
    count(...args: any[]): Promise<number>;
    destroy(id: string): Promise<void>;
    find(id: string): Promise<M | undefined>;
    findByUid(uid: string): Promise<M | undefined>;
    findByUserCode(userCode: string): Promise<M | undefined>;
    get(opts?: FindOptions): Promise<M[]>;
    revokeByGrantId(grantId: string): Promise<void>;
    upsert(id: string, data: M, expiresIn: number): Promise<void>;
}

import { RDBMSManagerOptions, FindOptions } from "../../../helper/rdbms";
import { OIDCModelAdapter, OIDCModelPayload, OIDCModelAdapterProps } from "../adapter";
export declare type OIDCModelRDBMSAdapterOptions = RDBMSManagerOptions;
export declare class OIDCModelRDBMSAdapter<M extends OIDCModelPayload = OIDCModelPayload> extends OIDCModelAdapter<M> {
    protected readonly props: OIDCModelAdapterProps;
    private readonly model;
    constructor(props: OIDCModelAdapterProps, options?: OIDCModelRDBMSAdapterOptions);
    start(): Promise<void>;
    consume(id: string): Promise<void>;
    count(...args: any[]): Promise<number>;
    destroy(id: string): Promise<void>;
    find(id: string): Promise<void | M>;
    findByUid(uid: string): Promise<void | M>;
    findByUserCode(userCode: string): Promise<void | M>;
    get(opts?: FindOptions): Promise<M[]>;
    revokeByGrantId(grantId: string): Promise<void>;
    upsert(id: string, data: M, expiresIn: number): Promise<void>;
}

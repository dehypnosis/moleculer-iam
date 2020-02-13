import { RDBMSManagerOptions } from "../../../helper/rdbms";
import { OIDCAdapter, OIDCAdapterProps } from "../adapter";
import { OIDCModelName, OIDCModelPayload } from "../model";
import { OIDC_RDBMS_Model } from "./model";
export declare type OIDC_RDBMS_AdapterOptions = RDBMSManagerOptions;
export declare class OIDC_RDBMS_Adapter extends OIDCAdapter {
    protected readonly props: OIDCAdapterProps;
    private readonly manager;
    readonly displayName = "RDBMS";
    constructor(props: OIDCAdapterProps, options?: OIDC_RDBMS_AdapterOptions);
    start(): Promise<void>;
    stop(): Promise<void>;
    protected createModel<T extends OIDCModelPayload = OIDCModelPayload>(name: OIDCModelName): OIDC_RDBMS_Model<T>;
}

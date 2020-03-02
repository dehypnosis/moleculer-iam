import { RDBMSManagerOptions } from "../../../../helper/rdbms";
import { OIDCAdapterProxy, OIDCAdapterProxyProps } from "../adapter";
import { OIDCModelProxyProps } from "../model";
import { OIDCRDBMSModelProxy } from "./model";
export declare type OIDCRDBMSAdapterProxyOptions = RDBMSManagerOptions;
export declare class OIDCRDBMSAdapterProxy extends OIDCAdapterProxy {
    protected readonly props: OIDCAdapterProxyProps;
    private readonly manager;
    readonly displayName = "RDBMS";
    constructor(props: OIDCAdapterProxyProps, options?: OIDCRDBMSAdapterProxyOptions);
    start(): Promise<void>;
    stop(): Promise<void>;
    protected createModel(props: OIDCModelProxyProps): OIDCRDBMSModelProxy;
}

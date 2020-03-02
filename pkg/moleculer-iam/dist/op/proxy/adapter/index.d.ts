import { OIDCMemoryAdapterProxy, OIDCMemoryAdapterProxyOptions } from "./memory";
import { OIDCRDBMSAdapterProxy, OIDCRDBMSAdapterProxyOptions } from "./rdbms";
export * from "./adapter";
export * from "./model";
export declare const OIDCAdapterProxyConstructors: {
    Memory: typeof OIDCMemoryAdapterProxy;
    RDBMS: typeof OIDCRDBMSAdapterProxy;
};
export declare type OIDCAdapterProxyConstructorOptions = {
    type: "Memory";
    options?: OIDCMemoryAdapterProxyOptions;
} | {
    type: "RDBMS";
    options: OIDCRDBMSAdapterProxyOptions;
};

import { OIDC_MemoryAdapter, OIDC_MemoryAdapterOptions } from "./memory";
import { OIDC_RDBMS_Adapter, OIDC_RDBMS_AdapterOptions } from "./rdbms";
export { OIDCAdapter } from "./adapter";
export { OIDCModel, OIDCModelPayload } from "./model";
export declare const OIDCAdapterConstructors: {
    Memory: typeof OIDC_MemoryAdapter;
    RDBMS: typeof OIDC_RDBMS_Adapter;
};
export declare type OIDCAdapterConstructorOptions = {
    type: "Memory";
    options?: OIDC_MemoryAdapterOptions;
} | {
    type: "RDBMS";
    options: OIDC_RDBMS_AdapterOptions;
};

import { OIDCMemoryAdapter, OIDCMemoryAdapterOptions } from "./memory";
import { OIDC_RDBMS_Adapter, OIDC_RDBMS_AdapterOptions } from "./rdbms";
export { OIDCAdapter } from "./adapter";
export { OIDCModel, OIDCModelPayload } from "./model";
export declare const OIDCAdapterConstructors: {
    Memory: typeof OIDCMemoryAdapter;
    RDBMS: typeof OIDC_RDBMS_Adapter;
};
export declare type OIDCAdapterConstructorOptions = {
    type: "Memory";
    options: OIDCMemoryAdapterOptions;
} | {
    type: "RDBMS";
    options: OIDC_RDBMS_AdapterOptions;
};

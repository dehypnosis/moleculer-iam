import { IDP_MemoryAdapter, IDP_MemoryAdapterOptions } from "./memory";
import { IDP_RDBMS_Adapter, IDP_RDBMS_AdapterOptions } from "./rdbms";
export { IDPAdapter, Transaction } from "./adapter";
export declare const IDPAdapterConstructors: {
    Memory: typeof IDP_MemoryAdapter;
    RDBMS: typeof IDP_RDBMS_Adapter;
};
export declare type IDPAdapterConstructorOptions = {
    type: "Memory";
    options?: IDP_MemoryAdapterOptions;
} | {
    type: "RDBMS";
    options: IDP_RDBMS_AdapterOptions;
};

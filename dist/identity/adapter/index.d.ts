export * from "./adapter";
import { IdentityModelMemoryAdapterOptions } from "./memory";
import { IdentityModelRDBMSAdapterOptions } from "./rdbms";
export declare const IdentityModelAdapterConstructors: {
    Memory: any;
    RDBMS: any;
};
export declare type IdentityModelAdapterConstructorOptions = {
    type: "Memory";
    options: IdentityModelMemoryAdapterOptions;
} | {
    type: "RDBMS";
    options: IdentityModelRDBMSAdapterOptions;
};

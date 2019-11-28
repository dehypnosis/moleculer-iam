import { Configuration } from "./types";
import { OIDCAdapterConstructorOptions } from "../adapter";
import { UserInteractionConfigurationKeys, UserInteractionDeviceFlowConfigurationKeys } from "../interaction";
export declare type OIDCProviderOptions = Omit<Configuration, "adapter"> & {
    issuer: string;
    trustProxy?: boolean;
    adapter?: OIDCAdapterConstructorOptions;
    findAccount?: never;
    features?: Configuration["features"] & {
        devInteractions?: never;
        deviceFlow?: Required<Configuration>["features"]["deviceFlow"] & {
            [key in UserInteractionDeviceFlowConfigurationKeys]?: never;
        };
    };
} & {
    [key in UserInteractionConfigurationKeys]?: never;
};
export declare const defaultOIDCProviderOptions: OIDCProviderOptions;

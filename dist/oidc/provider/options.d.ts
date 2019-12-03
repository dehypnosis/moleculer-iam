import { Configuration } from "./types";
import { OIDCAdapterConstructorOptions } from "../adapter";
import { InteractionConfigurationKeys, InternalInteractionDeviceFlowConfigurationKeys, ClientApplicationRendererOptions } from "../interaction";
export declare type OIDCProviderOptions = Omit<Configuration, "adapter"> & {
    issuer: string;
    trustProxy?: boolean;
    adapter?: OIDCAdapterConstructorOptions;
    findAccount?: never;
    features?: Configuration["features"] & {
        devInteractions?: never;
        deviceFlow?: Required<Configuration>["features"]["deviceFlow"] & {
            [key in InternalInteractionDeviceFlowConfigurationKeys]?: never;
        };
    };
} & {
    [key in InteractionConfigurationKeys]?: never;
} & {
    app?: ClientApplicationRendererOptions;
};
export declare const defaultOIDCProviderOptions: OIDCProviderOptions;

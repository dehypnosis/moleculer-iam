import { Configuration } from "./types";
import { OIDCAdapterConstructorOptions } from "../adapter";
import { IdentityFederationManagerOptions, InteractionRenderer } from "../interaction";
export declare type OIDCProviderOptions = Omit<Configuration, "adapter" | "claims" | "scopes" | "findAccount" | "dynamicScopes" | "interactions"> & {
    issuer: string;
    trustProxy?: boolean;
    adapter?: OIDCAdapterConstructorOptions;
    devMode?: boolean;
    federation?: IdentityFederationManagerOptions;
    render?: InteractionRenderer;
};
export declare const defaultOIDCProviderOptions: OIDCProviderOptions;

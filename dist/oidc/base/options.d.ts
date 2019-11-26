import { Configuration } from "oidc-provider";
export declare type OIDCProviderBaseOptions = Omit<Configuration, "adapter">;
export declare const defaultOIDCProviderBaseOptions: OIDCProviderBaseOptions;

import { Configuration, ClientMetadata } from "./types";
import { OIDCAdapterConstructorOptions } from "../adapter";
import { InteractionFactoryOptions } from "../interaction";
export interface OIDCProviderDiscoveryMetadata {
    display_values_supported?: string[];
    claim_types_supported?: string[];
    claims_locales_supported?: string[];
    ui_locales_supported?: string[];
    op_tos_uri?: string | null;
    op_policy_uri?: string | null;
    service_documentation?: string | null;
}
export declare type OIDCProviderOptions = Omit<Configuration, "adapter" | "claims" | "scopes" | "findAccount" | "dynamicScopes" | "interactions" | "discovery" | "client"> & {
    issuer: string;
    trustProxy?: boolean;
    devMode?: boolean;
    adapter?: OIDCAdapterConstructorOptions;
    interaction?: InteractionFactoryOptions;
    discovery?: OIDCProviderDiscoveryMetadata;
    client?: Partial<ClientMetadata>;
};
export declare const defaultOIDCProviderOptions: OIDCProviderOptions;

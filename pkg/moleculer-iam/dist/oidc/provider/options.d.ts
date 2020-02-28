/// <reference types="koa-bodyparser" />
/// <reference types="koa-passport" />
import { IdentityClaimsSchema, IdentityProvider } from "../../identity";
import { Logger } from "../../logger";
import { Provider, Configuration, ClientMetadata, Client } from "./types";
import { OIDCAdapter, OIDCAdapterConstructorOptions } from "../adapter";
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
};
export declare const defaultOIDCProviderOptions: OIDCProviderOptions;
export declare const parseOIDCProviderOptions: (props: {
    logger: Logger;
    idp: IdentityProvider;
}, opts: OIDCProviderOptions) => {
    methods: {
        configuration: () => Configuration;
        clientAdd: (metadata: Partial<ClientMetadata>, opt: {
            store: true;
        }) => Client;
        clientRemove: (id: string) => void;
    };
    syncSupportedClaimsAndScopes: (claimsSchemata: IdentityClaimsSchema[]) => void;
    routes: import("koa-compose").Middleware<import("koa").ParameterizedContext<unknown, unknown>>;
    adapter: OIDCAdapter;
    devModeEnabled: boolean;
    issuer: string;
};
export declare type OIDCProviderDebugOptions = {
    [key in "disable-implicit-force-https" | "disable-implicit-forbid-localhost"]: boolean;
};
export declare function applyDebugOptions(provider: Provider, logger: Logger, options: OIDCProviderDebugOptions): void;

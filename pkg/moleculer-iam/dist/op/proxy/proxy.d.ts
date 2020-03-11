/// <reference types="koa-bodyparser" />
/// <reference types="koa-passport" />
import { Configuration } from "oidc-provider";
import { FindOptions, WhereAttributeHash } from "../../helper/rdbms";
import { Logger } from "../../helper/logger";
import { IdentityProvider } from "../../idp";
import { ApplicationBuildOptions } from "../app";
import { OIDCModelName } from "./adapter";
import { StaticConfiguration } from "./config";
import { ClientMetadata } from "./proxy.types";
export declare type OIDCProviderProxyProps = {
    logger: Logger;
    idp: IdentityProvider;
};
export declare type OIDCProviderProxyOptions = StaticConfiguration & {
    app?: ApplicationBuildOptions;
};
export declare type ParsedLocale = {
    language: string;
    country: string;
};
export declare class OIDCProviderProxy {
    private readonly props;
    private readonly logger;
    private readonly provider;
    private readonly adapter;
    constructor(props: OIDCProviderProxyProps, options: OIDCProviderProxyOptions);
    private readonly hidden;
    readonly app: import("koa")<import("koa").DefaultState, import("koa").DefaultContext>;
    readonly configuration: Configuration;
    private _supportedLocales?;
    readonly supportedLocales: string[];
    parseLocale(locale?: string): ParsedLocale;
    readonly issuer: string;
    start(): Promise<void>;
    stop(): Promise<void>;
    readonly Session: import("./adapter").OIDCModelProxy;
    readonly AccessToken: import("./adapter").OIDCModelProxy;
    readonly AuthorizationCode: import("./adapter").OIDCModelProxy;
    readonly RefreshToken: import("./adapter").OIDCModelProxy;
    readonly DeviceCode: import("./adapter").OIDCModelProxy;
    readonly ClientCredentials: import("./adapter").OIDCModelProxy;
    readonly Client: import("./adapter").OIDCModelProxy;
    readonly InitialAccessToken: import("./adapter").OIDCModelProxy;
    readonly RegistrationAccessToken: import("./adapter").OIDCModelProxy;
    readonly Interaction: import("./adapter").OIDCModelProxy;
    readonly ReplayDetection: import("./adapter").OIDCModelProxy;
    readonly PushedAuthorizationRequest: import("./adapter").OIDCModelProxy;
    findClient(id: string): Promise<import("oidc-provider").AdapterPayload | undefined>;
    findClientOrFail(id: string): Promise<import("oidc-provider").AdapterPayload>;
    createClient(metadata: Omit<ClientMetadata, "client_secret">): Promise<any>;
    updateClient(metadata: Omit<ClientMetadata, "client_secret"> & {
        reset_client_secret?: boolean;
    }): Promise<any>;
    deleteClient(id: string): Promise<void>;
    getClients(args?: FindOptions): Promise<import("oidc-provider").AdapterPayload[]>;
    countClients(args?: WhereAttributeHash): Promise<number>;
    private static generateClientSecret;
    static readonly volatileModelNames: ReadonlyArray<Exclude<OIDCModelName, "Client" | "ClientCredentials">>;
    countModels(kind: (typeof OIDCProviderProxy.volatileModelNames)[number], args?: WhereAttributeHash): Promise<number>;
    getModels(kind: (typeof OIDCProviderProxy.volatileModelNames)[number], args?: FindOptions): Promise<import("oidc-provider").AdapterPayload[]>;
    deleteModels(kind: (typeof OIDCProviderProxy.volatileModelNames)[number], args?: FindOptions): Promise<number>;
    syncSupportedClaimsAndScopes(): Promise<void>;
    private updateSupportedClaimsAndScopes;
}

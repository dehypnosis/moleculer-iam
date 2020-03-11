/// <reference types="koa-bodyparser" />
/// <reference types="koa-passport" />
import { Configuration } from "oidc-provider";
import { FindOptions, WhereAttributeHash } from "../../helper/rdbms";
import { IdentityProvider } from "../../idp";
import { Logger } from "../../logger";
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
    private get hidden();
    get app(): import("koa")<import("koa").DefaultState, import("koa").DefaultContext>;
    get configuration(): Configuration;
    get supportedLocales(): string[];
    parseLocale(locale?: string): ParsedLocale;
    get issuer(): string;
    start(): Promise<void>;
    stop(): Promise<void>;
    get Session(): import("./adapter").OIDCModelProxy;
    get AccessToken(): import("./adapter").OIDCModelProxy;
    get AuthorizationCode(): import("./adapter").OIDCModelProxy;
    get RefreshToken(): import("./adapter").OIDCModelProxy;
    get DeviceCode(): import("./adapter").OIDCModelProxy;
    get ClientCredentials(): import("./adapter").OIDCModelProxy;
    get Client(): import("./adapter").OIDCModelProxy;
    get InitialAccessToken(): import("./adapter").OIDCModelProxy;
    get RegistrationAccessToken(): import("./adapter").OIDCModelProxy;
    get Interaction(): import("./adapter").OIDCModelProxy;
    get ReplayDetection(): import("./adapter").OIDCModelProxy;
    get PushedAuthorizationRequest(): import("./adapter").OIDCModelProxy;
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

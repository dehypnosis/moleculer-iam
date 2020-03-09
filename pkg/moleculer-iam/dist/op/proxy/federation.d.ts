import { Strategy } from "passport";
import { ProviderConfigBuilder } from "./config";
import { ApplicationRequestContext } from "./app.types";
import { Logger } from "../../logger";
import { Identity, IdentityProvider } from "../../idp";
export interface IdentityFederationProviderConfigurationMap {
    [provider: string]: IdentityFederationProviderConfiguration<any, any>;
}
declare type ForbiddenCustomOptions = "clientID" | "clientSecret" | "secret" | "scope" | "callback" | "strategy" | "scopes" | "clientId" | "client" | "callbackURL" | "callbackUrl";
export declare type IdentityFederationProviderConfiguration<CustomProfile extends {}, CustomOptions extends {}> = {
    clientID: string;
    clientSecret: string;
    scope: string;
    callback: IdentityFederationCallbackHandler<CustomProfile>;
    strategy: IdentityFederationStrategyFactory<CustomProfile, CustomOptions>;
} & Partial<Omit<CustomOptions, ForbiddenCustomOptions>>;
export declare type IdentityFederationStrategyFactory<CustomProfile extends {}, CustomOptions extends {}> = (options: Omit<CustomOptions, ForbiddenCustomOptions> & {
    clientID: string;
    clientSecret: string;
    scope: string;
    callbackURL: string;
}, verify: IdentityFederationCallbackVerifyFunction<CustomProfile>) => Strategy;
export interface IdentityFederationCallbackArgs<CustomProfile extends {}> {
    accessToken: string;
    refreshToken?: string;
    profile: CustomProfile;
    scope: string[];
    idp: IdentityProvider;
    logger: Logger;
}
export declare type IdentityFederationCallbackHandler<CustomProfile extends {}> = (args: IdentityFederationCallbackArgs<CustomProfile>) => Promise<Identity>;
export declare type IdentityFederationCallbackVerifyFunction<CustomProfile extends {}> = (accessToken: string, refreshToken: string | undefined, profile: CustomProfile, done: (error: Error | null, callbackArgs?: IdentityFederationCallbackArgs<CustomProfile>, info?: any) => void) => void;
export declare class IdentityFederationBuilder {
    protected readonly builder: ProviderConfigBuilder;
    private readonly passport;
    private readonly scopes;
    private readonly callbacks;
    private config;
    constructor(builder: ProviderConfigBuilder);
    private _prefix;
    readonly prefix: string;
    setCallbackPrefix(prefix: string): this;
    readonly getCallbackURL: (providerName: string) => string;
    readonly providerNames: string[];
    setProviderConfigurationMap(configMap: IdentityFederationProviderConfigurationMap): this;
    _dangerouslyBuild(): void;
    handleRequest(ctx: ApplicationRequestContext, next: () => Promise<void>, provider: string): Promise<void>;
    handleCallback(ctx: ApplicationRequestContext, next: () => Promise<void>, provider: string): Promise<Identity>;
}
export {};

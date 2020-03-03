/// <reference types="koa-bodyparser" />
/// <reference types="koa-passport" />
import * as Application from "koa";
import { Configuration } from "oidc-provider";
import { IdentityProvider } from "../../idp";
import { Logger } from "../../logger";
import { InteractionBuildOptions } from "../interaction";
import { StaticConfiguration } from "./config";
export declare type OIDCProviderProxyProps = {
    logger: Logger;
    idp: IdentityProvider;
};
export declare type OIDCProviderProxyOptions = StaticConfiguration & {
    interaction?: InteractionBuildOptions;
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
    readonly app: import("koa")<Application.DefaultState, Application.DefaultContext>;
    readonly configuration: Configuration;
    readonly supportedLocales: string[];
    parseLocale(locale: string): ParsedLocale;
    readonly issuer: string;
    start(): Promise<void>;
    stop(): Promise<void>;
    deleteModels(...args: any[]): any;
    countModels(...args: any[]): any;
    syncSupportedClaimsAndScopes(defs: ReadonlyArray<{
        scope: string;
        key: string;
    }>): void;
}

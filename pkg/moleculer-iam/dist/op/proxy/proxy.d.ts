/// <reference types="koa-bodyparser" />
/// <reference types="koa-passport" />
import { Configuration } from "oidc-provider";
import { IdentityProvider } from "../../idp";
import { Logger } from "../../logger";
import { ApplicationBuildOptions } from "../app";
import { StaticConfiguration } from "./config";
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
    parseLocale(locale: string): ParsedLocale;
    get issuer(): string;
    start(): Promise<void>;
    stop(): Promise<void>;
    deleteModels(...args: any[]): any;
    countModels(...args: any[]): any;
    syncSupportedClaimsAndScopes(defs: ReadonlyArray<{
        scope: string;
        key: string;
    }>): void;
}

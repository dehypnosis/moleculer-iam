/// <reference types="node" />
import * as http from "http";
import * as http2 from "http2";
import * as https from "https";
import Koa from "koa";
import { IHelmetConfiguration } from "helmet";
import compose from "koa-compose";
import { Logger } from "../helper/logger";
import { OIDCProvider, ParsedLocale } from "../op";
import { LoggingOptions } from "./logging";
export declare type IAMServerProps = {
    op: OIDCProvider;
    logger?: Logger;
};
export declare type IAMServerOptions = {
    security?: IHelmetConfiguration;
    logging?: LoggingOptions;
    app?: (op: OIDCProvider) => Promise<compose.Middleware<any>>;
    assets?: {
        path: string;
        prefix: string;
        maxAge?: number;
    }[];
    http?: {
        hostname: string;
        port?: number;
    } & http.ServerOptions;
    https?: {
        hostname: string;
        port?: number;
    } & https.ServerOptions;
    http2?: {
        hostname: string;
        port?: number;
    } & http2.ServerOptions;
    http2s?: {
        hostname: string;
        port?: number;
    } & http2.SecureServerOptions;
};
export interface IAMServerRequestContextProps {
    locale: ParsedLocale;
}
export declare type IAMServerRequestContext = Koa.ParameterizedContext<IAMServerRequestContextProps>;
export declare class IAMServer {
    private readonly props;
    private readonly logger;
    private readonly app;
    private readonly options;
    constructor(props: IAMServerProps, opts?: IAMServerOptions);
    private http?;
    private https?;
    private http2?;
    private http2s?;
    private working;
    start(): Promise<void>;
    private listenCallback;
    stop(): Promise<void>;
}

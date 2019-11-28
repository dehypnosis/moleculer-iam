/// <reference types="node" />
import * as http from "http";
import * as http2 from "http2";
import * as https from "https";
import { IHelmetConfiguration } from "helmet";
import { Logger } from "../logger";
import { OIDCProvider } from "../oidc";
import { LoggingOptions } from "./logging";
export declare type IAMServerProps = {
    oidc: OIDCProvider;
    logger?: Logger;
};
export declare type IAMServerOptions = {
    security?: IHelmetConfiguration;
    logging?: LoggingOptions;
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

/// <reference types="node" />
import * as http from "http";
import * as http2 from "http2";
import * as https from "https";
import { Logger } from "./logger";
import { Configuration, ClientMetadata } from "oidc-provider";
export { ClientMetadata } from "oidc-provider";
export declare type OIDCProviderProps = {
    logger?: Logger;
    issuer: string;
    trustProxy?: boolean;
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
export declare type OIDCProviderOptions = Configuration;
export declare class OIDCProvider {
    private readonly props;
    private readonly provider;
    private readonly providerProps;
    private readonly logger;
    private static defaultOptions;
    constructor(props: OIDCProviderProps, opts?: OIDCProviderOptions);
    private http?;
    private https?;
    private http2?;
    private http2s?;
    start(): void;
    findClient(id: string): Promise<any>;
    upsertClient(metadata: ClientMetadata): Promise<any>;
}

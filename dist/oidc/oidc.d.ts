/// <reference types="node" />
import * as http from "http";
import * as http2 from "http2";
import * as https from "https";
import { OIDCProviderBaseProps, OIDCProviderBaseOptions } from "./base";
import { createClientMethods } from "./methods";
export declare type OIDCProviderProps = {
    server?: {
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
} & OIDCProviderBaseProps;
export declare type OIDCProviderOptions = {} & OIDCProviderBaseOptions;
export declare class OIDCProvider {
    private readonly props;
    private readonly base;
    private readonly logger;
    readonly client: ReturnType<typeof createClientMethods>;
    constructor(props: OIDCProviderProps, options?: OIDCProviderOptions);
    private http?;
    private https?;
    private http2?;
    private http2s?;
    start(): Promise<void>;
    stop(): Promise<void>;
}

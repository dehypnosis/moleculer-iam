/// <reference types="node" />
import * as http from "http";
import * as http2 from "http2";
import * as https from "https";
import { Logger } from "../logger";
import { ClientMetadata, Client } from "oidc-provider";
import "./typings";
import { OIDCProviderOptions } from "./options";
export { ClientMetadata, Client, errors as OIDCErrors } from "oidc-provider";
export { OIDCProviderOptions } from "./options";
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
    private working;
    start(): void;
    stop(): void;
    findClient(id: string): Promise<Client | null>;
    createClient(metadata: ClientMetadata): Promise<Client>;
    updateClient(metadata: ClientMetadata): Promise<Client>;
    removeClient(id: string): Promise<void>;
}

/// <reference types="koa-bodyparser" />
import { FindOptions } from "../../helper/rdbms";
import { IdentityProvider } from "../../identity";
import { Logger } from "../../logger";
import { ClientMetadata, Configuration as OriginalProviderConfiguration } from "./types";
import { OIDCProviderOptions } from "./options";
export declare type OIDCProviderProps = {
    logger?: Logger;
    identity: IdentityProvider;
};
export declare class OIDCProvider {
    private readonly props;
    private readonly logger;
    private readonly adapter;
    private readonly original;
    constructor(props: OIDCProviderProps, options: OIDCProviderOptions);
    readonly idp: IdentityProvider;
    readonly config: OriginalProviderConfiguration;
    readonly defaultRoutes: Readonly<{
        [key: string]: string | undefined;
    }>;
    readonly router: import("koa-compose").Middleware<import("koa").ParameterizedContext<import("koa").DefaultState, import("koa").DefaultContext>>;
    readonly discoveryPath: string;
    readonly issuer: string;
    private working;
    start(): Promise<void>;
    stop(): Promise<void>;
    readonly client: {
        find(id: string): Promise<ClientMetadata | undefined>;
        findOrFail(id: string): Promise<ClientMetadata>;
        create(metadata: ClientMetadata): Promise<ClientMetadata>;
        update(metadata: ClientMetadata): Promise<ClientMetadata>;
        remove(id: string): Promise<void>;
        get(opts?: FindOptions | undefined): Promise<ClientMetadata[]>;
        count(): Promise<number>;
    };
    private clientMethods?;
    private createClientMethods;
}

/// <reference types="koa-bodyparser" />
/// <reference types="koa-passport" />
import { FindOptions, WhereAttributeHash } from "../../helper/rdbms";
import { IdentityProvider } from "../../identity";
import { Logger } from "../../logger";
import { ClientMetadata, Configuration as OriginalProviderConfiguration, OIDCModelName, VolatileOIDCModelName } from "./types";
import { OIDCProviderOptions } from "./options";
export declare type OIDCProviderProps = {
    logger?: Logger;
    idp: IdentityProvider;
};
export declare class OIDCProvider {
    private readonly props;
    private readonly logger;
    private readonly adapter;
    private readonly original;
    readonly devModeEnabled: boolean;
    private readonly defaultClientConfig;
    constructor(props: OIDCProviderProps, options: OIDCProviderOptions);
    readonly idp: IdentityProvider;
    readonly routes: import("koa-compose").Middleware<import("koa").ParameterizedContext<any, {}>>;
    private readonly originalHiddenProps;
    readonly config: OriginalProviderConfiguration;
    readonly defaultRoutes: Readonly<{
        [key: string]: string | undefined;
    }>;
    readonly discoveryPath: string;
    readonly issuer: string;
    private working;
    start(): Promise<void>;
    stop(): Promise<void>;
    private readonly Client;
    findClient(id: string): Promise<ClientMetadata | undefined>;
    findClientOrFail(id: string): Promise<ClientMetadata>;
    createClient(metadata: Omit<ClientMetadata, "client_secret">): Promise<any>;
    updateClient(metadata: Omit<ClientMetadata, "client_secret"> & {
        reset_client_secret?: boolean;
    }): Promise<any>;
    deleteClient(id: string): Promise<void>;
    getClients(args?: FindOptions): Promise<ClientMetadata[]>;
    countClients(args?: WhereAttributeHash): Promise<number>;
    private static generateClientSecret;
    static readonly volatileModelNames: ReadonlyArray<VolatileOIDCModelName>;
    countModels(kind: VolatileOIDCModelName, args?: WhereAttributeHash): Promise<number>;
    getModels(kind: OIDCModelName, args?: FindOptions): Promise<any[]>;
    deleteModels(kind: OIDCModelName, args?: FindOptions): Promise<number>;
    syncSupportedClaimsAndScopes(): Promise<void>;
}

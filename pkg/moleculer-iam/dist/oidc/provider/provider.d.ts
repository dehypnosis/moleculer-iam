/// <reference types="koa-bodyparser" />
/// <reference types="koa-passport" />
import { FindOptions, WhereAttributeHash } from "../../helper/rdbms";
import { IdentityProvider } from "../../identity";
import { Logger } from "../../logger";
import { ClientMetadata, Configuration, OIDCModelName, VolatileOIDCModelName } from "./types";
import { OIDCProviderOptions } from "./options";
export declare type OIDCProviderProps = {
    logger?: Logger;
    idp: IdentityProvider;
};
export declare class OIDCProvider {
    private readonly props;
    private readonly logger;
    private readonly provider;
    constructor(props: OIDCProviderProps, options: OIDCProviderOptions);
    get idp(): IdentityProvider;
    get routes(): import("koa-compose").Middleware<import("koa").ParameterizedContext<unknown, unknown>>;
    get config(): Configuration;
    get issuer(): string;
    private working;
    start(): Promise<void>;
    stop(): Promise<void>;
    private get Client();
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

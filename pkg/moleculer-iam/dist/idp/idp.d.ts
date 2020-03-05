import { FindOptions, WhereAttributeHash } from "../helper/rdbms";
import { Logger } from "../logger";
import { Identity } from "./identity";
import { IDPAdapter, IDPAdapterConstructorOptions, Transaction } from "./adapter";
import { OIDCAccountClaims, OIDCAccountCredentials } from "../op";
import { IdentityClaimsManager, IdentityClaimsManagerOptions } from "./claims";
import { IdentityMetadata } from "./metadata";
import { ValidationError } from "../validator";
export declare type IdentityProviderProps = {
    logger?: Logger;
};
export declare type IdentityProviderOptions = {
    adapter?: IDPAdapterConstructorOptions | IDPAdapter;
    claims?: IdentityClaimsManagerOptions;
};
export declare class IdentityProvider {
    protected readonly props: IdentityProviderProps;
    private readonly logger;
    readonly adapter: IDPAdapter;
    readonly claims: IdentityClaimsManager;
    constructor(props: IdentityProviderProps, opts?: Partial<IdentityProviderOptions>);
    private working;
    start(): Promise<void>;
    stop(): Promise<void>;
    readonly validateEmailOrPhoneNumber: (args: {
        email?: string | undefined;
        phone_number?: string | undefined;
    }) => true | ValidationError[];
    find(args: WhereAttributeHash): Promise<Identity | undefined>;
    findOrFail(args: WhereAttributeHash): Promise<Identity>;
    count(args?: WhereAttributeHash): Promise<number>;
    get(args?: FindOptions): Promise<Identity[]>;
    create(args: {
        metadata: Partial<IdentityMetadata>;
        scope: string[] | string;
        claims: Partial<OIDCAccountClaims>;
        credentials: Partial<OIDCAccountCredentials>;
    }, transaction?: Transaction, ignoreUndefinedClaims?: boolean): Promise<Identity>;
    validate(args: {
        id?: string;
        scope: string[] | string;
        claims: Partial<OIDCAccountClaims>;
        credentials?: Partial<OIDCAccountCredentials>;
    }): Promise<void>;
    validateCredentials(credentials: Partial<OIDCAccountCredentials>): Promise<void>;
}
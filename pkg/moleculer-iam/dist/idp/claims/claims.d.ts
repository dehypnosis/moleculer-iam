import { Logger } from "../../logger";
import { IDPAdapter } from "../adapter";
import { IdentityClaimsSchema, IdentityClaimsSchemaPayload } from "./types";
import { WhereAttributeHash } from "../../helper/rdbms";
export declare type IdentityClaimsManagerProps = {
    adapter: IDPAdapter;
    logger?: Logger;
};
export declare type IdentityClaimsManagerOptions = {
    baseClaims?: IdentityClaimsSchemaPayload[];
    mandatoryScopes?: string[];
};
export declare class IdentityClaimsManager {
    protected readonly props: IdentityClaimsManagerProps;
    private readonly validatePayload;
    private readonly logger;
    private readonly options;
    constructor(props: IdentityClaimsManagerProps, opts?: Partial<IdentityClaimsManagerOptions>);
    private get adapter();
    start(): Promise<void>;
    stop(): Promise<void>;
    private hashClaimsSchemaPayload;
    private createClaimsSchema;
    private compileClaimsValidator;
    private compileClaimsMigrationStrategy;
    readonly mandatoryScopes: ReadonlyArray<string>;
    private _supportedScopes;
    get supportedScopes(): {
        [scope: string]: string[];
    };
    private syncSupportedScopes;
    onClaimsSchemaUpdated(): Promise<void>;
    getActiveClaimsSchemata(): Promise<IdentityClaimsSchema[]>;
    getClaimsSchemata(args: {
        scope: string | string[];
        key?: string;
        version?: string;
        active?: boolean;
    }): Promise<IdentityClaimsSchema[]>;
    getClaimsSchema(args: {
        key: string;
        version?: string;
        active?: boolean;
    }): Promise<void | IdentityClaimsSchema>;
    forceReloadClaims(args: {
        where?: WhereAttributeHash;
        ids?: string[];
    }): Promise<void>;
    forceDeleteClaimsSchemata(...keys: string[]): Promise<void>;
    defineClaimsSchema(payload: IdentityClaimsSchemaPayload): Promise<IdentityClaimsSchema>;
}

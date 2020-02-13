import { IDPAdapter, IDPAdapterProps, Transaction } from "../adapter";
import { OIDCAccountClaims, OIDCAccountCredentials } from "../../../oidc";
import { IdentityMetadata } from "../../metadata";
import { IdentityClaimsSchema } from "../../claims";
import { FindOptions, WhereAttributeHash } from "../../../helper/rdbms";
export declare type IDP_MemoryAdapterOptions = {};
export declare class IDP_MemoryAdapter extends IDPAdapter {
    protected readonly props: IDPAdapterProps;
    readonly displayName = "Memory";
    constructor(props: IDPAdapterProps, options?: IDP_MemoryAdapterOptions);
    find(args: WhereAttributeHash): Promise<string | void>;
    private filerMetadata;
    get(args: FindOptions): Promise<string[]>;
    count(args: WhereAttributeHash): Promise<number>;
    delete(id: string): Promise<boolean>;
    private readonly identityMetadataMap;
    createOrUpdateMetadata(id: string, metadata: Partial<IdentityMetadata>, transaction?: Transaction): Promise<void>;
    getMetadata(id: string): Promise<IdentityMetadata | void>;
    private readonly identityClaimsMap;
    createOrUpdateVersionedClaims(id: string, claims: {
        key: string;
        value: any;
        schemaVersion: string;
    }[]): Promise<void>;
    onClaimsUpdated(id: string, updatedClaims: Partial<OIDCAccountClaims>, transaction?: Transaction): Promise<void>;
    getVersionedClaims(id: string, claims: {
        key: string;
        schemaVersion?: string;
    }[]): Promise<Partial<OIDCAccountClaims>>;
    private readonly identityCredentialsMap;
    createOrUpdateCredentials(id: string, credentials: Partial<OIDCAccountCredentials>, transaction?: Transaction): Promise<boolean>;
    assertCredentials(id: string, credentials: Partial<OIDCAccountCredentials>): Promise<boolean>;
    private schemata;
    createClaimsSchema(schema: IdentityClaimsSchema, transaction?: Transaction): Promise<void>;
    forceDeleteClaimsSchema(key: string): Promise<void>;
    getClaimsSchema(args: {
        key: string;
        version?: string;
        active?: boolean;
    }): Promise<IdentityClaimsSchema | void>;
    setActiveClaimsSchema(args: {
        key: string;
        version: string;
    }, transaction?: Transaction): Promise<void>;
    getClaimsSchemata(args: {
        scope: string[];
        key?: string;
        version?: string;
        active?: boolean;
    }): Promise<IdentityClaimsSchema[]>;
    transaction(): Promise<Transaction>;
    private readonly migrationLocksMap;
    acquireMigrationLock(key: string): Promise<void>;
    touchMigrationLock(key: string, migratedIdentitiesNumber: number): Promise<void>;
    releaseMigrationLock(key: string): Promise<void>;
}

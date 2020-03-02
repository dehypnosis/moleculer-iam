import { FindOptions, WhereAttributeHash, RDBMSManagerOptions, Transaction } from "../../../helper/rdbms";
import { IDPAdapter, IDPAdapterProps } from "../adapter";
import { IdentityMetadata } from "../../metadata";
import { IdentityClaimsSchema } from "../../claims";
import { OIDCAccountClaims, OIDCAccountCredentials } from "../../../op";
export declare type IDP_RDBMS_AdapterOptions = RDBMSManagerOptions & {
    claimsMigrationLockTimeoutSeconds?: number;
};
export declare class IDP_RDBMS_Adapter extends IDPAdapter {
    protected readonly props: IDPAdapterProps;
    private readonly manager;
    readonly displayName = "RDBMS";
    private readonly claimsMigrationLockTimeoutSeconds;
    constructor(props: IDPAdapterProps, options?: IDP_RDBMS_AdapterOptions);
    start(): Promise<void>;
    stop(): Promise<void>;
    get IdentityCache(): import("../../../helper/rdbms").ModelClass;
    find(args: WhereAttributeHash): Promise<string | void>;
    count(args: WhereAttributeHash): Promise<number>;
    get(args: FindOptions): Promise<string[]>;
    delete(id: string, transaction?: Transaction): Promise<boolean>;
    get IdentityMetadata(): import("../../../helper/rdbms").ModelClass;
    createOrUpdateMetadata(id: string, metadata: Partial<IdentityMetadata>, transaction?: Transaction): Promise<void>;
    getMetadata(id: string): Promise<IdentityMetadata | void>;
    get IdentityClaims(): import("../../../helper/rdbms").ModelClass;
    createOrUpdateVersionedClaims(id: string, claims: {
        key: string;
        value: any;
        schemaVersion: string;
    }[]): Promise<void>;
    private readonly getVersionedClaimsLoader;
    getVersionedClaims(id: string, claims: {
        key: string;
        schemaVersion?: string;
    }[]): Promise<Partial<OIDCAccountClaims>>;
    get IdentityClaimsCache(): import("../../../helper/rdbms").ModelClass;
    onClaimsUpdated(id: string, updatedClaims: Partial<OIDCAccountClaims>, transaction?: Transaction): Promise<void>;
    get IdentityCredentials(): import("../../../helper/rdbms").ModelClass;
    createOrUpdateCredentials(id: string, credentials: Partial<OIDCAccountCredentials>, transaction?: Transaction): Promise<boolean>;
    assertCredentials(id: string, credentials: Partial<OIDCAccountCredentials>): Promise<boolean>;
    get IdentityClaimsSchema(): import("../../../helper/rdbms").ModelClass;
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
    get IdentityClaimsMigrationLock(): import("../../../helper/rdbms").ModelClass;
    acquireMigrationLock(key: string): Promise<void>;
    touchMigrationLock(key: string, migratedIdentitiesNumber: number): Promise<void>;
    releaseMigrationLock(key: string): Promise<void>;
}

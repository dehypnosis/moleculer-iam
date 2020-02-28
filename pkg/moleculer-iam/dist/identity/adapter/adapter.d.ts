import * as _ from "lodash";
import { Logger } from "../../logger";
import { FindOptions, WhereAttributeHash } from "../../helper/rdbms";
import { OIDCAccountClaims, OIDCAccountCredentials } from "../../oidc";
import { IdentityMetadata } from "../metadata";
import { IdentityClaimsSchema } from "../claims";
import { ValidationError } from "../../validator";
export declare type IDPAdapterProps = {
    logger?: Logger;
};
export interface Transaction {
    commit(): Promise<void>;
    rollback(): Promise<void>;
}
export declare abstract class IDPAdapter {
    protected readonly props: IDPAdapterProps;
    protected readonly logger: Logger;
    abstract readonly displayName: string;
    constructor(props: IDPAdapterProps, options?: any);
    start(): Promise<void>;
    stop(): Promise<void>;
    abstract find(args: WhereAttributeHash): Promise<string | void>;
    abstract count(args: WhereAttributeHash): Promise<number>;
    abstract get(args: FindOptions): Promise<string[]>;
    validate(args: {
        id?: string;
        scope: string[];
        claims: Partial<OIDCAccountClaims>;
        credentials?: Partial<OIDCAccountCredentials>;
    }): Promise<void>;
    create(args: {
        metadata: Partial<IdentityMetadata>;
        scope: string[];
        claims: OIDCAccountClaims;
        credentials: Partial<OIDCAccountCredentials>;
    }, transaction?: Transaction): Promise<string>;
    abstract delete(id: string, transaction?: Transaction): Promise<boolean>;
    getClaims(id: string, scope: string[]): Promise<OIDCAccountClaims>;
    protected readonly getCachedActiveClaimsSchemata: ((scope: string[]) => Promise<{
        activeClaimsVersions: {
            [key: string]: string;
        };
        claimsSchemata: IdentityClaimsSchema[];
        validateClaims: (object: any) => true | ValidationError[];
        validClaimsKeys: string[];
        uniqueClaimsSchemata: IdentityClaimsSchema[];
        validateClaimsUniqueness: (id: string | void, object: {
            [key: string]: any;
        }) => Promise<true | ValidationError[]>;
        immutableClaimsSchemata: IdentityClaimsSchema[];
        validateClaimsImmutability: (id: string, object: {
            [key: string]: any;
        }) => Promise<true | ValidationError[]>;
    }>) & _.MemoizedFunction;
    createOrUpdateClaimsWithValidation(id: string, claims: Partial<OIDCAccountClaims>, scope: string[], creating: boolean, transaction?: Transaction, ignoreUndefinedClaims?: boolean): Promise<void>;
    deleteClaims(id: string, scope: string[], transaction?: Transaction): Promise<void>;
    abstract onClaimsUpdated(id: string, updatedClaims: Partial<OIDCAccountClaims>, transaction?: Transaction): Promise<void>;
    abstract createOrUpdateVersionedClaims(id: string, claims: {
        key: string;
        value: any;
        schemaVersion: string;
    }[], transaction?: Transaction): Promise<void>;
    abstract getVersionedClaims(id: string, claims: {
        key: string;
        schemaVersion?: string;
    }[]): Promise<Partial<OIDCAccountClaims>>;
    abstract createClaimsSchema(schema: IdentityClaimsSchema, transaction?: Transaction): Promise<void>;
    abstract forceDeleteClaimsSchema(key: string, transaction?: Transaction): Promise<void>;
    onClaimsSchemaUpdated(): Promise<void>;
    abstract getClaimsSchema(args: {
        key: string;
        version?: string;
        active?: boolean;
    }): Promise<IdentityClaimsSchema | void>;
    abstract getClaimsSchemata(args: {
        scope: string[];
        key?: string;
        version?: string;
        active?: boolean;
    }): Promise<IdentityClaimsSchema[]>;
    abstract setActiveClaimsSchema(args: {
        key: string;
        version: string;
    }, transaction?: Transaction): Promise<void>;
    abstract getMetadata(id: string): Promise<IdentityMetadata | void>;
    abstract createOrUpdateMetadata(id: string, metadata: Partial<IdentityMetadata>, transaction?: Transaction): Promise<void>;
    abstract assertCredentials(id: string, credentials: Partial<OIDCAccountCredentials>): Promise<boolean>;
    protected abstract createOrUpdateCredentials(id: string, credentials: Partial<OIDCAccountCredentials>, transaction?: Transaction): Promise<boolean>;
    private readonly testCredentials;
    createOrUpdateCredentialsWithValidation(id: string, credentials: Partial<OIDCAccountCredentials>, transaction?: Transaction): Promise<boolean>;
    validateCredentials(credentials: Partial<OIDCAccountCredentials>): Promise<void>;
    abstract transaction(): Promise<Transaction>;
    abstract acquireMigrationLock(key: string): Promise<void>;
    abstract touchMigrationLock(key: string, migratedIdentitiesNumber: number): Promise<void>;
    abstract releaseMigrationLock(key: string): Promise<void>;
}

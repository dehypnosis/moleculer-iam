import { OIDCAccount, OIDCAccountClaims, OIDCAccountCredentials, OIDCClaimsInfo } from "../oidc";
import { Transaction } from "./adapter";
import { IdentityMetadata } from "./metadata";
import { IdentityProvider } from "./provider";
export interface IdentityProps {
    id: string;
    provider: IdentityProvider;
}
export declare class Identity implements OIDCAccount {
    private readonly props;
    constructor(props: IdentityProps);
    readonly id: Readonly<string>;
    private readonly adapter;
    readonly accountId: Readonly<string>;
    /**
     * @param use - can either be "id_token" or "userinfo", depending on where the specific claims are intended to be put in.
     * @param scope - the intended scope, while oidc-provider will mask
     *   claims depending on the scope automatically you might want to skip
     *   loading some claims from external resources etc. based on this detail
     *   or not return them in id tokens but only userinfo and so on.
     * @param claims
     * @param rejected
     */
    claims(use?: string, scope?: string | string[], claims?: OIDCClaimsInfo, rejected?: string[]): Promise<OIDCAccountClaims>;
    updateClaims(claims: Partial<OIDCAccountClaims>, scope?: string | string[], transaction?: Transaction, ignoreUndefinedClaims?: boolean): Promise<void>;
    deleteClaims(scope?: string | string[], transaction?: Transaction): Promise<void>;
    metadata(): Promise<IdentityMetadata>;
    updateMetadata(metadata: Partial<IdentityMetadata>, transaction?: Transaction): Promise<void>;
    assertCredentials(credentials: Partial<OIDCAccountCredentials>): Promise<boolean>;
    updateCredentials(credentials: Partial<OIDCAccountCredentials>, transaction?: Transaction): Promise<boolean>;
    update(scope: string | string[] | undefined, claims: Partial<OIDCAccountClaims>, metadata?: Partial<IdentityMetadata>, credentials?: Partial<OIDCAccountCredentials>, transaction?: Transaction, ignoreUndefinedClaims?: boolean): Promise<void>;
    json(scope?: string | string[]): Promise<{
        id: string;
        claims: Partial<OIDCAccountClaims>;
        metadata: IdentityMetadata;
    }>;
    delete(permanently?: boolean, transaction?: Transaction): Promise<void>;
    isSoftDeleted(): Promise<boolean>;
    restoreSoftDeleted(transaction?: Transaction): Promise<void>;
}

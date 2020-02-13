import { Account, AccountClaims } from "../oidc";
export declare type OIDCClaimsInfo = {
    [key: string]: null | {
        essential?: boolean;
        value?: string;
        values?: string[];
        [key: string]: any;
    };
};
export interface OIDCAccountCredentials {
    password: string;
    password_confirmation?: string;
}
export declare type OIDCAccountClaimsFilter = {
    use: string;
    scope: string[];
    claims?: OIDCClaimsInfo;
    rejected?: string[];
};
export interface OIDCAccountClaims extends AccountClaims {
    sub: string;
    name?: string;
    given_name?: string;
    middle_name?: string;
    family_name?: string;
    nickname?: string;
    preferred_username?: string;
    picture?: string;
    website?: string;
    gender?: string;
    birthdate?: string;
    zoneinfo?: string;
    locale?: string;
    updated_at?: Date;
    email?: string;
    email_verified?: boolean;
    phone_number?: string;
    phone_number_verified?: boolean;
    address?: OIDCAddressClaims;
}
export interface OIDCAddressClaims {
    formatted: string;
    street_address: string;
    locality: string;
    region: string;
    postal_code: string;
    country: string;
}
export interface OIDCAccount extends Account {
    accountId: string;
    /**
     * @param use - can either be "id_token" or "userinfo"; depending on
     *   where the specific claims are intended to be put in.
     * @param scope - the intended scope; while oidc-provider will mask
     *   claims depending on the scope automatically you might want to skip
     *   loading some claims from external resources etc. based on this detail
     *   or not return them in id tokens but only userinfo and so on.
     * @param claims
     * @param rejected
     */
    claims(use: string, scope: string, claims: OIDCClaimsInfo, rejected: string[]): Promise<OIDCAccountClaims>;
}

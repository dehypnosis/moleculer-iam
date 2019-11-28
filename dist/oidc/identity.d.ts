export interface IdentityOIDCClaims {
    sub: string;
    name?: string;
    family_name?: string;
    given_name?: string;
    middle_name?: string;
    nickname?: string;
    picture?: string;
    updated_at?: Date;
    email?: string;
    email_verified?: boolean;
    phone?: string;
    phone_verified?: string;
}
export interface IdentityWithOIDCSupport {
    /**
     * @param use - can either be "id_token" or "userinfo", depending on
     *   where the specific claims are intended to be put in.
     * @param scope - the intended scope, while oidc-provider will mask
     *   claims depending on the scope automatically you might want to skip
     *   loading some claims from external resources etc. based on this detail
     *   or not return them in id tokens but only userinfo and so on.
     */
    claims(use: "id_token" | "userinfo", scope: string[]): Promise<IdentityOIDCClaims>;
}

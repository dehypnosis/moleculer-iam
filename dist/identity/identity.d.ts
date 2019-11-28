import { OIDCAccount, OIDCAccountClaims, OIDCClaimsInfo } from "../oidc";
export declare class Identity implements OIDCAccount {
    readonly id: string;
    constructor(id: string);
    readonly accountId: string;
    /**
     * @param use - can either be "id_token" or "userinfo", depending on where the specific claims are intended to be put in.
     * @param scope - the intended scope, while oidc-provider will mask
     *   claims depending on the scope automatically you might want to skip
     *   loading some claims from external resources etc. based on this detail
     *   or not return them in id tokens but only userinfo and so on.
     * @param claims
     * @param rejected
     */
    claims(use: string, scope: string, claims: OIDCClaimsInfo, rejected: string[]): Promise<OIDCAccountClaims>;
}

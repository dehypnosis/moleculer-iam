// ref: https://github.com/panva/node-oidc-provider/blob/master/docs/README.md#accounts
import { Account, AccountClaims, ErrorOut } from "oidc-provider";

export type OIDCClaimsInfo = {
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

export type OIDCAccountClaimsFilter = {
  use: string;
  scope: string[];
  claims?: OIDCClaimsInfo;
  rejected?: string[];
};

export interface OIDCAccountClaims extends AccountClaims {
  // mandatory (unique id)
  sub: string;

  // profile scope
  name?: string; // full name
  given_name?: string;
  middle_name?: string;
  family_name?: string;
  nickname?: string;
  preferred_username?: string;
  picture?: string;
  website?: string;
  gender?: string; // male | female | other
  birthdate?: string; // YYYY-MM-DD
  zoneinfo?: string; // Europe/Paris | America/Los_Angeles
  locale?: string; // en-US | ko-KR
  updated_at?: Date;

  // email scope
  email?: string;
  email_verified?: boolean;

  // phone scope
  phone_number?: string; // +1 (425) 555-1212 | +56 (2) 687 2400 | +1 (604) 555-1234;ext=5678
  phone_number_verified?: boolean;

  // address scope
  address?: OIDCAddressClaims;
}

export interface OIDCAddressClaims {
  formatted: string; // Full mailing address, formatted for display or use on a mailing label. This field MAY contain multiple lines, separated by newlines.
  street_address: string; // Full street address component, which MAY include house number, street name, Post Office Box, and multi-line extended street address information.
  locality: string; // City or locality component.
  region: string; // State, province, prefecture, or region component.
  postal_code: string; // Zip code or postal code component.
  country: string; // Country name component.
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

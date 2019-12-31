import * as _ from "lodash";
import { OIDCAccount, OIDCAccountClaims, OIDCAccountCredentials, OIDCClaimsInfo } from "../oidc";
import { Transaction } from "./adapter";
import { defaultIdentityMetadata, IdentityMetadata } from "./metadata";
import { Errors } from "./error";
import { IdentityProvider } from "./provider";

export interface IdentityProps {
  id: string;
  provider: IdentityProvider;
}

export class Identity implements OIDCAccount {
  constructor(private readonly props: IdentityProps) {
  }

  public get id(): Readonly<string> {
    return this.props.id;
  }

  private get adapter() {
    return this.props.provider.adapter;
  }

  public get accountId(): Readonly<string> {
    return this.props.id;
  }

  /**
   * @param use - can either be "id_token" or "userinfo", depending on where the specific claims are intended to be put in.
   * @param scope - the intended scope, while oidc-provider will mask
   *   claims depending on the scope automatically you might want to skip
   *   loading some claims from external resources etc. based on this detail
   *   or not return them in id tokens but only userinfo and so on.
   * @param claims
   * @param rejected
   */
  public async claims(use: string = "userinfo", scope: string | string[] = "", claims?: OIDCClaimsInfo, rejected?: string[]): Promise<OIDCAccountClaims> {
    return this.adapter.getClaims(this.id, {
      use,
      scope: typeof scope === "string" ? scope.split(" ").filter(s => !!s) : scope,
      claims,
      rejected,
    });
  }

  public async updateClaims(claims: Partial<OIDCAccountClaims>, scope: string | string[] = "", transaction?: Transaction): Promise<void> {
    const scopeWithoutOpenID = (typeof scope === "string" ? scope.split(" ").filter(s => !!s) : scope).filter(s => s !== "openid");
    await this.adapter.createOrUpdateClaims(this.id, claims, {
      scope: scopeWithoutOpenID,
    }, transaction);
  }

  public get mandatoryScopes() {
    return this.props.provider.claims.mandatoryScopes;
  }

  public async deleteClaims(scope: string | string[] = "", transaction?: Transaction): Promise<void> {
    // check mandatory scopes
    const scopes = (typeof scope === "string" ? scope.split(" ").filter(s => !!s) : scope);
    if (scopes.some(s => this.mandatoryScopes.includes(s))) {
      throw new Errors.BadRequestError(`cannot delete mandatory scopes: ${this.mandatoryScopes}`);
    }

    await this.adapter.deleteClaims(this.id, scopes, transaction);
  }

  /* identity metadata (federation information, etc. not-versioned) */
  public async metadata(): Promise<IdentityMetadata> {
    const metadata = await this.adapter.getMetadata(this.id);
    if (!metadata) throw new Errors.UnexpectedError(`empty metadata: ${this.id}`);
    return metadata;
  }

  public async updateMetadata(metadata: Partial<IdentityMetadata>, transaction?: Transaction): Promise<void> {
    await this.adapter.createOrUpdateMetadata(this.id, _.defaultsDeep(metadata, defaultIdentityMetadata), transaction);
  }

  /* credentials */
  public async validateCredentials(credentials: Partial<OIDCAccountCredentials>): Promise<void> {
    return this.adapter.validateCredentials(credentials);
  }

  public async assertCredentials(credentials: Partial<OIDCAccountCredentials>): Promise<boolean> {
    return this.adapter.assertCredentials(this.id, credentials);
  }

  public async updateCredentials(credentials: Partial<OIDCAccountCredentials>, transaction?: Transaction): Promise<boolean> {
    await this.adapter.validateCredentials(credentials);
    return this.adapter.createOrUpdateCredentials(this.id, credentials, transaction);
  }

  /* delete identity */
  public async delete(permanently: boolean = false, transaction?: Transaction): Promise<void> {
    if (permanently) {
      await this.adapter.delete(this.id, transaction);
    } else {
      await this.adapter.createOrUpdateMetadata(this.id, {softDeleted: true}, transaction);
    }
  }

  public async isSoftDeleted(): Promise<boolean> {
    return this.metadata().then(meta => meta.softDeleted);
  }

  public async restoreSoftDeleted(transaction?: Transaction): Promise<void> {
    await this.adapter.createOrUpdateMetadata(this.id, {softDeleted: false}, transaction);
  }
}

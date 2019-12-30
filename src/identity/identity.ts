import * as _ from "lodash";
import { OIDCAccount, OIDCAccountClaims, OIDCAccountCredentials, OIDCClaimsInfo } from "../oidc";
import { IDPAdapter, Transaction } from "./adapter";
import { defaultIdentityMetadata, IdentityMetadata } from "./metadata";
import { Errors } from "./error";

export interface IdentityProps {
  id: string;
  adapter: IDPAdapter;
}

export class Identity implements OIDCAccount {
  constructor(public readonly props: IdentityProps) {
  }

  public get id(): Readonly<string> {
    return this.props.id;
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
    return this.props.adapter.getClaims(this, {
      use,
      scope: typeof scope === "string" ? scope.split(" ").filter(s => !!s) : scope,
      claims,
      rejected,
    });
  }

  public async updateClaims(claims: Partial<OIDCAccountClaims>, scope: string | string[] = "", transaction?: Transaction): Promise<void> {
    let isolated = false;
    if (!transaction) {
      isolated = true;
      transaction = await this.props.adapter.transaction();
    }
    try {
      const scopeWithoutOpenID = (typeof scope === "string" ? scope.split(" ").filter(s => !!s) : scope).filter(s => s !== "openid");
      await this.props.adapter.createOrUpdateClaims(this, claims, {
        scope: scopeWithoutOpenID,
      }, transaction);
      await this.props.adapter.onClaimsUpdated(this, claims, transaction);
      if (isolated) await transaction.commit();
    } catch (err) {
      if (isolated) await transaction.rollback();
      throw err;
    }
  }

  // TODO: deleteClaims

  /* identity metadata (federation information, etc. not-versioned) */
  public async metadata(): Promise<IdentityMetadata> {
    const metadata = await this.props.adapter.getMetadata(this);
    if (!metadata) throw new Errors.IdentityNotExistsError();
    return metadata;
  }

  public async updateMetadata(metadata: Partial<IdentityMetadata>, transaction?: Transaction): Promise<void> {
    await this.props.adapter.createOrUpdateMetadata(this, _.defaultsDeep(metadata, defaultIdentityMetadata), transaction);
  }

  /* credentials */
  public async validateCredentials(credentials: Partial<OIDCAccountCredentials>): Promise<void> {
    return this.props.adapter.validateCredentials(credentials);
  }

  public async assertCredentials(credentials: Partial<OIDCAccountCredentials>): Promise<boolean> {
    return this.props.adapter.assertCredentials(this, credentials);
  }

  public async updateCredentials(credentials: Partial<OIDCAccountCredentials>, transaction?: Transaction): Promise<boolean> {
    await this.props.adapter.validateCredentials(credentials);
    return this.props.adapter.createOrUpdateCredentials(this, credentials, transaction);
  }

  /* delete identity */
  public async delete(permanently: boolean = false, transaction?: Transaction): Promise<void> {
    if (permanently) {
      await this.props.adapter.delete(this, transaction);
    } else {
      await this.props.adapter.createOrUpdateMetadata(this, {softDeleted: true}, transaction);
    }
  }

  public async isSoftDeleted(): Promise<boolean> {
    return this.metadata().then(meta => meta.softDeleted);
  }

  public async restoreSoftDeleted(transaction?: Transaction): Promise<void> {
    await this.props.adapter.createOrUpdateMetadata(this, {softDeleted: false}, transaction);
  }
}

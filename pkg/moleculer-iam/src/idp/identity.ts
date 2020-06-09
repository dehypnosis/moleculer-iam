import * as _ from "lodash";
import { OIDCAccount, OIDCAccountClaims, OIDCAccountCredentials, OIDCClaimsInfo } from "../op";
import { Transaction } from "./adapter";
import { defaultIdentityMetadata, IdentityMetadata } from "./metadata";
import { IAMErrors } from "./error";
import { IdentityProvider } from "./idp";

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
    return this.adapter.getClaims(this.id, typeof scope === "string" ? scope.split(" ").filter(s => !!s) : scope);
  }

  public async updateClaims(claims: Partial<OIDCAccountClaims>, scope: string | string[] = "", transaction?: Transaction, ignoreUndefinedClaims?: boolean): Promise<void> {
    await this.adapter.createOrUpdateClaimsWithValidation(this.id, claims, typeof scope === "string" ? scope.split(" ").filter(s => !!s) : scope, false, transaction, ignoreUndefinedClaims);
  }

  public async deleteClaims(scope: string | string[] = "", transaction?: Transaction): Promise<void> {
    // check mandatory scopes
    const scopes = (typeof scope === "string" ? scope.split(" ").filter(s => !!s) : scope);
    const mandatoryScopes = this.props.provider.claims.mandatoryScopes;
    if (scopes.some(s => mandatoryScopes.includes(s))) {
      throw new Error(`cannot delete mandatory scopes: ${mandatoryScopes}`);
    }

    await this.adapter.deleteClaims(this.id, scopes, transaction);
  }

  /* identity metadata (federation information, etc. not-versioned) */
  public async metadata(): Promise<IdentityMetadata> {
    const metadata = await this.adapter.getMetadata(this.id);
    if (!metadata) throw new Error(`empty metadata: ${this.id}`);
    return metadata;
  }

  public async updateMetadata(metadata: Partial<IdentityMetadata>, transaction?: Transaction): Promise<void> {
    await this.adapter.createOrUpdateMetadata(this.id, _.defaultsDeep(metadata, defaultIdentityMetadata), transaction);
  }

  /* credentials */
  public async assertCredentials(credentials: Partial<OIDCAccountCredentials>): Promise<boolean|null> {
    return this.adapter.assertCredentials(this.id, credentials);
  }

  public async updateCredentials(credentials: Partial<OIDCAccountCredentials>, transaction?: Transaction): Promise<boolean> {
    return this.adapter.createOrUpdateCredentialsWithValidation(this.id, credentials, transaction);
  }

  /* update all */
  public async update(scope: string | string[] = "", claims: Partial<OIDCAccountClaims>, metadata?: Partial<IdentityMetadata>, credentials?: Partial<OIDCAccountCredentials>, transaction?: Transaction, ignoreUndefinedClaims?: boolean) {
    // validate claims and credentials
    if (typeof scope === "string") {
      scope = scope.split(" ").filter(s => !!s);
    } else if (!scope) {
      scope = [];
    }

    // save metadata, claims, credentials
    let isolated = false;
    if (!transaction) {
      transaction = transaction = await this.adapter.transaction();
      isolated = true;
    }
    try {
      if (typeof claims === "object" && claims !== null && Object.keys(claims).length > 0) {
        await this.updateClaims(claims, scope, transaction, ignoreUndefinedClaims);
      }
      if (typeof credentials === "object" && credentials !== null && Object.keys(credentials).length > 0) {
        await this.updateCredentials(credentials, transaction);
      }
      if (typeof metadata === "object" && metadata !== null && Object.keys(metadata).length > 0) {
        await this.updateMetadata(metadata, transaction);
      }
      if (isolated) {
        await transaction.commit();
      }
    } catch (err) {
      if (isolated) {
        await transaction!.rollback();
      }
      throw err;
    }
    return;
  }

  /* fetch all */
  public async json(scope: string | string[] = ""): Promise<{ id: string, claims: Partial<OIDCAccountClaims>, metadata: IdentityMetadata }> {
    const [claims, metadata] = await Promise.all([this.claims(undefined, scope), this.metadata()]);
    return {
      id: this.id,
      claims,
      metadata,
    };
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

import * as _ from "lodash";
import { OIDCAccount, OIDCAccountClaims, OIDCAccountCredentials, OIDCClaimsInfo } from "../oidc";
import { IDPAdapter } from "./adapter";
import { defaultIdentityMetadata, IdentityMetadata } from "./metadata";
import { validator } from "../validator";
import { Errors } from "./error";

export interface IdentityProps {
  id: string;
  adapter: IDPAdapter;
}

export class Identity<T extends { [key: string]: any } = {}> implements OIDCAccount {
  constructor(public readonly props: IdentityProps & T) {
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

  public async updateClaims(claims: Partial<OIDCAccountClaims>, scope: string | string[] = ""): Promise<void> {
    const transaction = await this.props.adapter.transaction();
    try {
      await this.props.adapter.createOrUpdateClaims(this, claims, {
        scope: typeof scope === "string" ? scope.split(" ").filter(s => !!s) : scope,
      }, true);
      await this.props.adapter.onClaimsUpdated(this);
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  /* identity metadata (federation information, etc. not-versioned) */
  public async metadata(): Promise<IdentityMetadata> {
    const metadata = await this.props.adapter.getMetadata(this);
    if (!metadata) throw new Errors.IdentityNotExistsError();
    return metadata;
  }

  public async updateMetadata(metadata: Partial<IdentityMetadata>): Promise<void> {
    await this.props.adapter.createOrUpdateMetadata(this, _.defaultsDeep(metadata, defaultIdentityMetadata));
  }

  /* credentials */
  // TODO: make credentials customizable...
  private readonly testCredentials = validator.compile({
    password: {
      type: "string",
      min: 4,
      max: 16,
      optional: true,
    },
  });

  public async validateCredentials(credentials: Partial<OIDCAccountCredentials>): Promise<void> {
    const result = this.testCredentials(credentials);
    if (result !== true) {
      throw new Errors.ValidationError(result);
    }
  }

  public async assertCredentials(credentials: Partial<OIDCAccountCredentials>): Promise<boolean> {
    return await this.props.adapter.assertCredentials(this, credentials);
  }

  public async updateCredentials(credentials: Partial<OIDCAccountCredentials>): Promise<boolean> {
    await this.validateCredentials(credentials);
    return this.props.adapter.createOrUpdateCredentials(this, credentials);
  }

  /* delete identity */
  public async delete(permanently: boolean = false): Promise<void> {
    if (permanently) {
      await this.props.adapter.delete(this);
    } else {
      await this.props.adapter.createOrUpdateMetadata(this, {softDeleted: true});
    }
  }

  public async isSoftDeleted(): Promise<boolean> {
    return this.metadata().then(meta => meta.softDeleted);
  }

  public async restoreSoftDeleted(): Promise<void> {
    await this.props.adapter.createOrUpdateMetadata(this, {softDeleted: false});
  }
}

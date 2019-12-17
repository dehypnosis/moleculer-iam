import { OIDCAccount, OIDCAccountClaims, OIDCAccountCredentials, OIDCClaimsInfo } from "../oidc";
import { IDPAdapter } from "./adapter";
import { IdentityMetadata } from "./metadata";
import { validator } from "../validator";
import { Errors } from "./error";

export interface IdentityProps {
  id: string;
  adapter: IDPAdapter;

  [key: string]: any;
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
    return this.props.adapter.claims(this, {
      use,
      scope: typeof scope === "string" ? scope.split(" ").filter(s => !!s) : scope,
      claims,
      rejected,
    });
  }

  public async updateClaims(claims: Partial<OIDCAccountClaims>, scope: string | string[] = ""): Promise<void> {
    return this.props.adapter.updateClaims(this, claims, {
      scope: typeof scope === "string" ? scope.split(" ").filter(s => !!s) : scope,
    });
  }

  /* identity metadata (federation information, etc. not-versioned) */
  public async metadata(): Promise<IdentityMetadata> {
    return this.props.adapter.metadata(this);
  }

  public async updateMetadata(metadata: Partial<IdentityMetadata>): Promise<void> {
    await this.props.adapter.updateMetadata(this, metadata);
  }

  /* credentials */
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
    return this.props.adapter.updateCredentials(this, credentials);
  }

  /* delete identity */
  public async delete(permanently: boolean = false): Promise<void> {
    if (permanently) {
      await this.props.adapter.delete(this);
    } else {
      await this.props.adapter.updateMetadata(this, { softDeleted: true });
    }
  }

  public async isSoftDeleted(): Promise<boolean> {
    return this.metadata().then(meta => meta.softDeleted);
  }

  public async restoreSoftDeleted(): Promise<void> {
    await this.props.adapter.updateMetadata(this, { softDeleted: false });
  }
}

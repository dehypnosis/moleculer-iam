import { FindOptions } from "../helper/rdbms";

export type Identity = {};

export class IdentityProvider {
  public async find(id: string): Promise<Identity> {
    return undefined;
  }

  public async createRegistrationSession(payload: Identity): Promise<Identity> {
    return undefined;
  }

  public async register(payload: Identity): Promise<Identity> {
    return undefined;
  }

  public async update(payload: Identity): Promise<Identity> {
    return undefined;
  }

  public async updateCredentials() {
  }

  public async remove(id: string, opts?: { permanent?: boolean }): Promise<void> {
  }

  public async get(opts?: FindOptions): Promise<Identity[]> {
    return [];
  }

  public async findEmail() {
  }; // secondary email, or mobile

  /* federation */
  public async federateOtherProvider() {
  };

  public async federateCustomSource() {
  };

  /* verification */
  public async verifyEmail() {
  };

  public async sendEmailVerificationCode() {
  }; // different model with identity itself for volatile registration

  public async verifyMobile() {
  };

  public async sendMobileVerificationCode() {
  }; // different model with identity itself for volatile registration
}

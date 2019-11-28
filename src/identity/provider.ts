import { FindOptions } from "../helper/rdbms";
import { Logger } from "../logger";
import { Identity } from "./identity";

export type IdentityProviderProps = {
  logger?: Logger,
};

export type IdentityProviderOptions = {};

export class IdentityProvider {
  private readonly logger: Logger;

  constructor(protected readonly props: IdentityProviderProps, opts?: IdentityProviderOptions) {
    this.logger = props.logger || console;
  }

  /* lifecycle */
  private working = false;

  public async start() {
    if (this.working) {
      return;
    }

    // ...
    this.logger.info("identity provider has been started");

    this.working = true;
  }

  public async stop() {
    if (!this.working) {
      return;
    }

    // ...
    this.logger.info("identity provider has been stopped");

    this.working = false;
  }

  public async find(id: string): Promise<Identity> {
    return {} as any;
  }

  public async createRegistrationSession(payload: any): Promise<any> {
    return {} as any;
  }

  public async register(payload: any): Promise<Identity> {
    return {} as any;
  }

  public async update(payload: any): Promise<Identity> {
    return {} as any;
  }

  public async updateCredentials() {
  }

  public async remove(id: string, opts?: { permanent?: boolean }): Promise<void> {
  }

  public async get(opts?: FindOptions): Promise<Identity[]> {
    return [];
  }

  public async findEmail() {
  } // secondary email, or mobile

  /* federation */
  public async federateOtherProvider() {
  }

  public async federateCustomSource() {
  }

  /* verification */
  public async verifyEmail() {
  }

  public async sendEmailVerificationCode() {
  } // different model with identity itself for volatile registration

  public async verifyMobile() {
  }

  public async sendMobileVerificationCode() {
  } // different model with identity itself for volatile registration
}

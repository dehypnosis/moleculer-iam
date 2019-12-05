import { FindOptions } from "../helper/rdbms";
import { Logger } from "../logger";
import { Identity } from "./identity";
import { IdentityNotExistsError, InvalidCredentialsError } from "./error";

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
    return new Identity(id, {
      name: "John Doe",
      email: id,
    });
  }

  public async findByEmail(email: string): Promise<Identity> {
    if (!email.endsWith(".com")) {
      throw IdentityNotExistsError;
    }
    return new Identity(email, {
      name: "John Doe",
      email,
    });
  }

  public async assertCredentials(id: string, credentials: { password: string }) {
    const identity = await this.find(id);
    if (credentials.password !== "1234") {
      throw InvalidCredentialsError;
    }
  }

  public async updateCredentials() {
  }

  public async register(payload: any): Promise<Identity> {
    return {} as any;
  }

  public async update(payload: any): Promise<Identity> {
    return {} as any;
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

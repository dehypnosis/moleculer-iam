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
      name: "Dong Wook Kim",
      picture: "https://static2.sharepointonline.com/files/fabric/office-ui-fabric-react-assets/persona-female.png",
      email: id,
    });
  }

  public async findByEmail(email: string): Promise<Identity> {
    if (!email.endsWith(".com")) {
      throw IdentityNotExistsError;
    }
    return new Identity(email, {
      name: "Dong Wook Kim",
      picture: "https://static2.sharepointonline.com/files/fabric/office-ui-fabric-react-assets/persona-female.png",
      email,
    });
  }

  public async findByPhone(phone: string): Promise<Identity> {
    return new Identity("find-by-phone@gmail.com", {
      name: "Dong Wook Kim",
      picture: "https://static2.sharepointonline.com/files/fabric/office-ui-fabric-react-assets/persona-female.png",
      email: "find-by-phone@gmail.com",
      phone,
    });
  }

  public async assertCredentials(id: Identity, credentials: { password: string }) {
    if (credentials.password !== "1234") {
      throw InvalidCredentialsError;
    }
  }

  public async updateCredentials(id: Identity, credentials: { password: string }) {
    if (credentials.password !== "1234") {
      throw InvalidCredentialsError;
    }
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

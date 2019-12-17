import * as _ from "lodash";
import { FindOptions } from "../helper/rdbms";
import { Logger } from "../logger";
import { Identity } from "./identity";
import { Errors } from "./error";
import { IDPAdapter, IDPAdapterConstructors, IDPAdapterConstructorOptions } from "./adapter";
import { OIDCAccountClaims, OIDCAccountCredentials } from "../oidc";
import { IdentityClaimsManager, IdentityClaimsManagerOptions } from "./claims";
import { IdentityMetadata } from "./metadata";
import { validator } from "../validator";

export type IdentityProviderProps = {
  logger?: Logger,
};

export type IdentityProviderOptions = {
  adapter?: IDPAdapterConstructorOptions | IDPAdapter,
  claims?: IdentityClaimsManagerOptions,
};

export class IdentityProvider {
  private readonly logger: Logger;
  private readonly adapter: IDPAdapter;
  public readonly claims: IdentityClaimsManager;

  constructor(protected readonly props: IdentityProviderProps, opts?: Partial<IdentityProviderOptions>) {
    this.logger = props.logger || console;
    const options: IdentityProviderOptions = _.defaultsDeep(opts || {}, {
      adapter: {
        type: "Memory",
        options: {},
      },
      claims: [],
    });

    // create adapter
    if (options.adapter instanceof IDPAdapter) {
      this.adapter = options.adapter;
    } else {
      const adapterKey: keyof (typeof IDPAdapterConstructors) = Object.keys(IDPAdapterConstructors).find(k => k.toLowerCase() === ((options.adapter as any)!.type || "").toLowerCase())
        || Object.keys(IDPAdapterConstructors)[0] as any;
      this.adapter = new IDPAdapterConstructors[adapterKey]({
        logger: this.logger,
      }, options.adapter!.options);
    }

    // create claims manager
    this.claims = new IdentityClaimsManager({
      logger: this.logger,
      adapter: this.adapter,
    }, options.claims);
  }

  /* lifecycle */
  private working = false;

  public async start() {
    if (this.working) {
      return;
    }

    // start adapter
    await this.adapter.start();

    // start claims manager
    await this.claims.start();

    this.logger.info("identity provider has been started");

    this.working = true;
  }

  public async stop() {
    if (!this.working) {
      return;
    }

    // stop claims manager
    await this.claims.stop();

    // stop adapter
    await this.adapter.stop();

    this.logger.info("identity provider has been stopped");

    this.working = false;
  }

  /* fetch account */
  public async find(args: { id?: string, email?: string, phone_number?: string }, metadata: Partial<IdentityMetadata> = {softDeleted: false}): Promise<Identity> {

    // validate args to normalize email and phone number
    const result = validator.validate(args, {
      id: {
        type: "string",
        optional: true,
      },
      email: {
        type: "email",
        normalize: true,
        optional: true,
      },
      phone_number: {
        type: "phone",
        optional: true,
      },
    });

    if (result !== true) {
      throw new Errors.ValidationError(result);
    }

    const identity = await this.adapter.find(args, metadata);
    if (!identity) throw new Errors.IdentityNotExistsError();
    return identity;
  }

  public async get(args?: FindOptions, metadata: Partial<IdentityMetadata> = {softDeleted: false}): Promise<Identity[]> {
    return this.adapter.get({offset: 0, limit: 10, ...args}, metadata);
  }

  public async count(args: Omit<FindOptions, "offset" | "limit"> = {}, metadata: Partial<IdentityMetadata> = {softDeleted: false}): Promise<number> {
    return this.adapter.count(args, metadata);
  }

  /* create account */
  public async create(args: { metadata: IdentityMetadata, scope: string[], claims: OIDCAccountClaims, credentials: Partial<OIDCAccountCredentials> }): Promise<Identity> {
    // push mandatory scopes
    args.scope = [...new Set([...args.scope, ...this.claims.mandatoryScopes])];
    return this.adapter.create(args);
  }
}

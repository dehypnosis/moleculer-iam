import * as _ from "lodash";
import { FindOptions } from "../helper/rdbms";
import { Logger } from "../logger";
import { Identity } from "./identity";
import { Errors } from "./error";
import { IDPAdapter, IDPAdapterConstructors, IDPAdapterConstructorOptions } from "./adapter";
import { OIDCAccountClaims, OIDCAccountCredentials } from "../oidc";
import { IdentityClaimsManager, IdentityClaimsManagerOptions } from "./claims";
import { IdentityMetadata } from "./metadata";
import { validator, ValidationError } from "../validator";
import { WhereAttributeHash } from "sequelize";
import uuid from "uuid";

export type IdentityProviderProps = {
  logger?: Logger,
};

export type IdentityProviderOptions = {
  adapter?: IDPAdapterConstructorOptions | IDPAdapter,
  claims?: IdentityClaimsManagerOptions,
};

export class IdentityProvider {
  private readonly logger: Logger;
  public readonly adapter: IDPAdapter;
  public readonly claims: IdentityClaimsManager;

  constructor(protected readonly props: IdentityProviderProps, opts?: Partial<IdentityProviderOptions>) {
    this.logger = props.logger || console;
    const options: IdentityProviderOptions = _.defaultsDeep(opts || {}, {
      adapter: {
        type: "Memory",
        options: {},
      },
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
  // args will be like { claims:{}, metadata:{}, ...}
  public readonly validateEmailOrPhoneNumber = validator.compile({
    email: {
      type: "email",
      normalize: true,
      optional: true,
    },
    phone_number: {
      type: "phone",
      optional: true,
    },
  }) as (args: {email?: string, phone_number?: string}) => ValidationError[] | true;

  public async find(args: WhereAttributeHash): Promise<Identity | void> {
    // set softDeleted=false
    if (!(args as any).metadata || typeof (args as any).metadata === "undefined") {
      if (!(args as any).metadata) (args as any).metadata = {};
      (args as any).metadata.softDeleted = false;
    }

    // validate args to normalize email and phone number
    if ((args as any).claims) {
      const result = this.validateEmailOrPhoneNumber((args as any).claims);
      if (result !== true) {
        throw new Errors.ValidationError(result);
      }
    }

    return this.adapter.find(args).then(id => id ? new Identity({ id, provider: this }) : undefined);
  }

  public async findOrFail(args: WhereAttributeHash): Promise<Identity> {
    const identity = await this.find(args);
    if (!identity) {
      throw new Errors.IdentityNotExistsError();
    }
    return identity;
  }

  // args will be like { claims:{}, metadata:{}, ...}
  public async count(args?: WhereAttributeHash): Promise<number> {
    // set softDeleted=false
    if (!args || !(args as any).metadata || typeof (args as any).metadata === "undefined") {
      if (!args) args = {};
      if (!(args as any).metadata) (args as any).metadata = {};
      (args as any).metadata.softDeleted = false;
    }
    return this.adapter.count(args);
  }

  // args will be like { where: { claims:{}, metadata:{}, ...}, offset: 0, limit: 100, ... }
  public async get(args?: FindOptions): Promise<Identity[]> {
    args = {offset: 0, limit: 10, ...args};

    // set softDeleted=false
    if (!args.where || !(args.where as any).metadata || typeof (args.where as any).metadata === "undefined") {
      if (!args.where) args.where = {};
      if (!(args.where as any).metadata) (args.where as any).metadata = {};
      (args.where as any).metadata.softDeleted = false;
    }
    return this.adapter.get(args)
      .then(ids => ids.map(id => new Identity({ id, provider: this })));
  }

  /* create account */
  public async create(args: { metadata: Partial<IdentityMetadata>, scope: string[] | string, claims: Partial<OIDCAccountClaims>, credentials: Partial<OIDCAccountCredentials> }): Promise<Identity> {
    if (args.claims && !args.claims.sub) {
      args.claims.sub = uuid.v4();
    }
    if (typeof args.scope === "string") {
      args.scope = args.scope.split(" ").map(s => s.trim()).filter(s => !!s);
    }
    // push mandatory scopes
    args.scope = [...new Set([...args.scope, ...this.claims.mandatoryScopes])];
    return this.adapter.create(args as any)
      .then(id => new Identity({ id, provider: this }));
  }

  public async validate(args: { scope: string[] | string, claims: Partial<OIDCAccountClaims>, credentials?: Partial<OIDCAccountCredentials> }): Promise<void> {
    if (typeof args.scope === "string") {
      args.scope = args.scope.split(" ").map(s => s.trim()).filter(s => !!s);
    }
    return this.adapter.validate(args as any);
  }
}

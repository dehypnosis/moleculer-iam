import * as _ from "lodash";
import { FindOptions, WhereAttributeHash } from "../lib/rdbms";
import { Logger } from "../lib/logger";
import { Identity } from "./identity";
import { IAMErrors } from "./error";
import { IDPAdapter, IDPAdapterConstructors, IDPAdapterConstructorOptions, Transaction } from "./adapter";
import { OIDCAccountClaims, OIDCAccountCredentials } from "../op";
import { IdentityClaimsManager, IdentityClaimsManagerOptions } from "./claims";
import { IdentityMetadata } from "./metadata";
import { validator, ValidationError } from "../lib/validator";

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
    email: [
      {
        type: "email",
        normalize: true,
        optional: true,
      },
      {
        type: "object",
        optional: true,
      },
    ],
    phone_number: [
      {
        type: "phone",
        optional: true,
      },
      {
        type: "object",
        optional: true,
      },
    ],
  }) as (args: { email?: string, phone_number?: string }) => ValidationError[] | true;

  public async find(args: WhereAttributeHash): Promise<Identity | undefined> {
    const where: any = args;

    // set softDeleted=false
    if (!where.metadata || typeof where.metadata === "undefined" || Object.keys(where.metadata).length === 0) {
      if (!where.metadata) where.metadata = {};
      where.metadata.softDeleted = false;
    }

    // validate args to normalize email and phone number
    if (where.claims) {
      this.validateEmailOrPhoneNumber(where.claims);
      // const result =
      // if (result !== true) {
      //   throw new (IAMErrors.ValidationFailed)(result);
      // }
    }

    return this.adapter.find(where).then(id => id ? new Identity({id, provider: this}) : undefined);
  }

  public async findOrFail(args: WhereAttributeHash): Promise<Identity> {
    const identity = await this.find(args);
    if (!identity) {
      throw new IAMErrors.IdentityNotExists();
    }
    return identity;
  }

  // args will be like { claims:{}, metadata:{}, ...}
  public async count(args?: WhereAttributeHash): Promise<number> {
    const where: any = args || {};

    // set softDeleted=false
    if (!where.metadata || typeof where.metadata === "undefined" || Object.keys(where.metadata).length === 0) {
      if (!where.metadata) where.metadata = {};
      where.metadata.softDeleted = false;
    }

    // validate args to normalize email and phone number
    if (where.claims) {
      this.validateEmailOrPhoneNumber(where.claims);
      // const result =
      // if (result !== true) {
      //   throw new IAMErrors.ValidationFailed(result);
      // }
    }

    return this.adapter.count(where);
  }

  // args will be like { where: { claims:{}, metadata:{}, ...}, offset: 0, limit: 100, ... }
  public async get(args?: FindOptions): Promise<Identity[]> {
    args = {offset: 0, limit: 10, ...args};

    if (typeof args.where === "object" && args.where !== null) {
      const where: any = args.where;

      // set softDeleted=false
      if (!where.metadata || typeof where.metadata === "undefined" || Object.keys(where.metadata).length === 0) {
        if (!where.metadata) where.metadata = {};
        where.metadata.softDeleted = false;
      }

      // validate args to normalize email and phone number
      if (where.claims) {
        this.validateEmailOrPhoneNumber(where.claims);
        // const result =
        // if (result !== true) {
        //   throw new IAMErrors.ValidationFailed(result);
        // }
      }
    }

    return this.adapter.get(args)
      .then(ids => ids.map(id => new Identity({id, provider: this})));
  }

  /* create account */
  public async create(args: { metadata: Partial<IdentityMetadata>, scope: string[] | string, claims: Partial<OIDCAccountClaims>, credentials: Partial<OIDCAccountCredentials> },
                      transaction?: Transaction, ignoreUndefinedClaims?: boolean): Promise<Identity> {
    if (typeof args.scope === "string") {
      args = {...args, scope: args.scope.split(" ").filter(s => !!s)};
    } else if (typeof args.scope === "undefined") {
      args = {...args, scope: []};
    }

    // push mandatory scopes
    args.scope = [...new Set([...args.scope, ...this.claims.mandatoryScopes])];

    return this.adapter.create(args as any, transaction, ignoreUndefinedClaims)
      .then(id => new Identity({id, provider: this}));
  }

  public async validate(args: { id?: string, scope: string[] | string, claims: Partial<OIDCAccountClaims>, credentials?: Partial<OIDCAccountCredentials> }): Promise<void> {
    if (typeof args.scope === "string") {
      args = {...args, scope: args.scope.split(" ").filter(s => !!s)};
    } else if (typeof args.scope === "undefined") {
      args = {...args, scope: []};
    }

    return this.adapter.validate(args as any);
  }

  public async validateCredentials(credentials: Partial<OIDCAccountCredentials>): Promise<void> {
    return this.adapter.validateCredentials(credentials);
  }
}

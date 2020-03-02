import * as _ from "lodash";
import { Context } from "koa";
import { Profile, Authenticator } from "passport";
import { KoaPassport } from "koa-passport";
import { Identity, Errors } from "../../idp";
import { ProviderConfigBuilder } from "../proxy";
import { defaultIdentityFederationProviderOptions, defaultIdentityFederationProviderStrategies, IdentityFederationCallback, IdentityFederationProviderOptions } from "./federation.preset";

export type IdentityFederationManagerOptions = IdentityFederationProviderOptions & { prefix?: string };

export type IdentityFederationManagerProps = {
  builder: ProviderConfigBuilder;
}

export class IdentityFederationManager {
  private readonly passport: Authenticator;
  private readonly scopes: { [provider: string]: string[] } = {};
  private readonly callbacks: { [provider: string]: IdentityFederationCallback } = {};
  public readonly callbackURL = (providerName: string) => this.builder.interaction.url(`${this.prefix}/${providerName}`);
  public readonly prefix: string;

  constructor(protected readonly builder: ProviderConfigBuilder, opts: IdentityFederationManagerOptions  = {}) {
    this.passport = new KoaPassport() as any;
    const { prefix = "/federate", ...providerOpts } = opts;
    this.prefix = prefix;

    const providerOptions = _.defaultsDeep(providerOpts, defaultIdentityFederationProviderOptions) as IdentityFederationProviderOptions;

    for (const [provider, options] of Object.entries(providerOptions)) {
      if (!options || !options.clientID) {
        continue;
      }
      const {scope, callback, ...customProviderStrategyOptions} = options!;
      this.scopes[provider] = typeof scope === "string" ? scope.split(" ").map(s => s.trim()).filter(s => !!s) : scope!;
      this.callbacks[provider] = callback!;
      const callbackURL = this.callbackURL(provider);
      this.builder.logger.info(`enable identity federation from ${provider} with ${this.scopes[provider].join(", ")} scopes: ${callbackURL}`);
      this.passport.use(
        new (defaultIdentityFederationProviderStrategies[provider])(
          {
            ...customProviderStrategyOptions,
            callbackURL,
          },
          async (accessToken: string, refreshToken: string, profile: Profile, done: any) => {
            try {
              done(null, {accessToken, profile});
            } catch (error) {
              done(error, null);
            }
          },
        ),
      );
    }
  }

  public get providerNames(): string[] {
    return Object.keys(this.callbacks);
  }

  public async request(provider: string, ctx: Context, next: () => Promise<void>): Promise<void> {
    return new Promise((resolve, reject) => {
      this.passport.authenticate(provider, {
        scope: this.scopes[provider],
        session: false,
        failWithError: true,
        prompt: "consent",
      })(ctx, next)
        .catch(reject)
        .then(resolve);
    });
  }

  public async callback(provider: string, ctx: Context, next: () => Promise<void>): Promise<Identity> {
    return new Promise((resolve, reject) => {
      this.passport.authenticate(provider, {
        scope: this.scopes[provider],
        session: false,
        failWithError: true,
        prompt: "consent",
      }, async (err: any, args: { accessToken: string, profile: Profile }) => {
        try {
          if (err) {
            throw err;
          }

          const identity = await this.callbacks[provider]({
            idp: this.builder.idp,
            logger: this.builder.logger,
            scope: this.scopes[provider],
            ...args,
          });

          if (!identity) {
            throw new Errors.IdentityNotExistsError();
          }
          resolve(identity);
        } catch (error) {
          this.builder.logger.error(error);
          reject(error);
        }
      })(ctx, next)
        .catch((err: any) => {
          this.builder.logger.error(err);
          reject(err);
        });
    });
  }
}

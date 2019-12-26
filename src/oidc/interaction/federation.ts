import * as _ from "lodash";
import { Context } from "koa";
import { Profile, Authenticator } from "passport";
import { KoaPassport } from "koa-passport";
import { Identity, IdentityProvider } from "../../identity";
import { Logger } from "../../logger";
import { Errors } from "../../identity/error";
import { defaultIdentityFederationManagerOptions, Strategies, FederationCallback, IdentityFederationManagerOptions } from "./federation_options";

export * from "./federation_options";

export type IdentityFederationManagerProps = {
  idp: IdentityProvider,
  callbackURL: (provider: string) => string,
  logger?: Logger,
};

export class IdentityFederationManager {
  private readonly logger: Logger;
  private readonly passport: Authenticator;
  private readonly scopes: { [provider: string]: string[] } = {};
  private readonly callbacks: { [provider: string]: FederationCallback } = {};

  constructor(protected readonly props: IdentityFederationManagerProps, opts: IdentityFederationManagerOptions = {}) {
    this.logger = props.logger || console;

    this.passport = new KoaPassport() as any;

    opts = _.defaultsDeep(opts, defaultIdentityFederationManagerOptions);

    for (const [provider, options] of Object.entries(opts)) {
      if (!options || !options.clientID) {
        continue;
      }
      const callbackURL = props.callbackURL(provider);
      const {scope, callback, ...providerOpts} = options!;
      this.scopes[provider] = typeof scope === "string" ? scope.split(" ").map(s => s.trim()).filter(s => !!s) : scope!;
      this.callbacks[provider] = callback!;
      this.logger.info(`enable identity federation from ${provider} with ${this.scopes[provider].join(", ")} scopes: ${callbackURL}`);
      this.passport.use(
        new (Strategies[provider])(
          {
            ...providerOpts,
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

  public get availableProviders(): string[] {
    return Object.keys(this.scopes);
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
            idp: this.props.idp,
            logger: this.logger,
            scope: this.scopes[provider],
            ...args,
          });

          if (!identity) {
            throw new Errors.IdentityNotExistsError();
          }
          resolve(identity);
        } catch (error) {
          this.logger.error(error);
          reject(error);
        }
      })(ctx, next)
        .catch((err: any) => {
          this.logger.error(err);
          reject(err);
        });
    });
  }
}

import { Context } from "koa";
import { Profile, Strategy, Authenticator } from "passport";
import { KoaPassport } from "koa-passport";
import { Identity, IdentityProvider } from "../../identity";
import { Logger } from "../../logger";
import { Errors } from "../../identity/error";

import { IOAuth2StrategyOption as GoogleOptions, OAuth2Strategy as GoogleStrategy } from "passport-google-oauth";

export type IdentityFederationManagerProps = {
  idp: IdentityProvider,
  callbackURL: (provider: string) => string,
  logger?: Logger,
};

export type FederationCallback = (idp: IdentityProvider, profile: Profile) => Promise<Identity>;

export type IdentityFederationManagerOptions = {
  google?: Omit<GoogleOptions, "callbackURL"> & { scope: string[], callback: FederationCallback },
};

const Strategies: {[provider: string]: new(opts: any, callback: any) => Strategy} = {
  google: GoogleStrategy,
};

export class IdentityFederationManager {
  private readonly logger: Logger;
  private readonly passport: Authenticator;
  private readonly scopes: {[provider: string]: string[] } = {};

  constructor(protected readonly props: IdentityFederationManagerProps, opts: IdentityFederationManagerOptions = {}) {
    this.logger = props.logger || console;

    this.passport = new KoaPassport() as any;

    for (const [provider, options] of Object.entries(opts)) {
      const callbackURL = props.callbackURL(provider);
      const { scope, callback, ...providerOpts } = options!;
      this.logger.info(`enable identity federation from ${provider} with ${scope.join(", ")} scopes: ${callbackURL}`);
      this.scopes[provider] = scope;
      this.passport.use(
        new (Strategies[provider])(
          {
            ...providerOpts,
            callbackURL,
          },
          async (accessToken: string, refreshToken: string, profile: Profile, done: any) => {
            try {
              const identity = await callback(props.idp, profile);
              if (!identity) {
                throw new Errors.IdentityNotExistsError();
              }
              done(null, identity);
            } catch (error) {
              done(error, null);
            }
          },
        ),
      );
    }
  }

  public async federate(provider: string, ctx: Context, next: () => Promise<Identity>) {
    return new Promise((resolve, reject) => {
      this.passport.authenticate(provider, {
        scope: this.scopes[provider],
        session: false,
        failWithError: true,
      }, (err: any, identity?: Identity) => {
        if (err) {
          return reject(err);
        }
        return resolve(identity);
      })(ctx, next)
        .catch(reject);
    });
  }
}

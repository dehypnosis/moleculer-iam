import { Authenticator, Strategy } from "passport";
import { KoaPassport } from "koa-passport";
import { ProviderConfigBuilder } from "./config";
import { ApplicationRequestContext } from "./app.types";
import { Logger } from "../../helper/logger";
import { Identity, IAMErrors, IdentityProvider } from "../../idp";
import { OIDCProviderProxyErrors } from "./error";

export interface IdentityFederationProviderConfigurationMap {
  [provider: string]: IdentityFederationProviderConfiguration<any, any>;
}

type ForbiddenCustomOptions = "clientID"|"clientSecret"|"secret"|"scope"|"callback"|"strategy"|"scopes"|"clientId"|"client"|"callbackURL"|"callbackUrl";

export type IdentityFederationProviderConfiguration<CustomProfile extends {}, CustomOptions extends {}> = {
  clientID: string;
  clientSecret: string;
  scope: string;
  callback: IdentityFederationCallbackHandler<CustomProfile>;
  strategy: IdentityFederationStrategyFactory<CustomProfile, CustomOptions>;
} & Partial<Omit<CustomOptions, ForbiddenCustomOptions>>;

export type IdentityFederationStrategyFactory<CustomProfile extends {}, CustomOptions extends {}> = (
  options: Omit<CustomOptions, ForbiddenCustomOptions> & { clientID: string, clientSecret: string, scope: string, callbackURL: string },
  verify: IdentityFederationCallbackVerifyFunction<CustomProfile>,
) => Strategy;

export interface IdentityFederationCallbackArgs<CustomProfile extends {}> {
  accessToken: string;
  refreshToken?: string;
  profile: CustomProfile;
  scope: string[];
  idp: IdentityProvider;
  logger: Logger;
}

export type IdentityFederationCallbackHandler<CustomProfile extends {}> = (args: IdentityFederationCallbackArgs<CustomProfile>) => Promise<Identity>;

export type IdentityFederationCallbackVerifyFunction<CustomProfile extends {}> = (
  accessToken: string,
  refreshToken: string | undefined,
  profile: CustomProfile,
  done: (error: Error|null, callbackArgs?: IdentityFederationCallbackArgs<CustomProfile>,info?: any) => void,
) => void;

export class IdentityFederationBuilder {
  private readonly passport: Authenticator;
  private readonly scopes: { [provider: string]: string[] } = {};
  private readonly callbacks: { [provider: string]: IdentityFederationCallbackHandler<any> } = {};
  private config: IdentityFederationProviderConfigurationMap = {};

  constructor(protected readonly builder: ProviderConfigBuilder) {
    this.passport = new KoaPassport() as any;
  }

  private _prefix: string = "/federate";
  public get prefix() {
    return this._prefix;
  }

  public setCallbackPrefix(prefix: string) {
    this.builder.assertBuilding();
    this._prefix = prefix;
    this.builder.logger.info(`OIDC federation route path configured:`, `${this.builder.app.prefix}${prefix}/:path`);
    return this;
  }

  public readonly getCallbackURL = (providerName: string) => this.builder.app.getURL(`${this._prefix}/${providerName}`, true);

  public get providerNames(): string[] {
    this.builder.assertBuilding(true);
    return Object.keys(this.callbacks);
  }

  public setProviderConfigurationMap(configMap: IdentityFederationProviderConfigurationMap) {
    this.builder.assertBuilding();
    this.config = {...this.config, ...configMap};
    return this;
  }

  public _dangerouslyBuild() {
    this.builder.assertBuilding();

    for (const [provider, options] of Object.entries(this.config)) {
      if (!options || !options.clientID) {
        continue;
      }

      // create strategy and apply
      const { scope, callback, strategy, ...restOptions} = options!;
      this.scopes[provider] = typeof scope === "string" ? scope.split(" ").map(s => s.trim()).filter(s => !!s) : scope as string[];
      this.callbacks[provider] = callback;

      const commonCallbackArgs = {
        scope: this.scopes[provider],
        idp: this.builder.idp,
        logger: this.builder.logger,
      };
      const callbackURL = this.getCallbackURL(provider);

      this.passport.use(
        strategy(
          {
            ...restOptions,
            scope,
            callbackURL,
          },
          async (accessToken, refreshToken, profile, next) => {
            this.builder.logger.info(`try identity federation from ${provider} with ${this.scopes[provider].join(", ")} scopes:`, profile);
            try {
              next(null, {
                accessToken,
                profile,
                ...commonCallbackArgs,
              });
            } catch (error) {
              next(error);
            }
          },
        ),
      );

      // remember scopes and callback handlers
      this.builder.logger.info(`enable identity federation from ${provider} with ${this.scopes[provider].join(", ")} scopes: ${callbackURL}`);
    }
  }

  private assertProvider(provider: string) {
    if (!this.providerNames.includes(provider)) {
      throw new OIDCProviderProxyErrors.InvalidFederationProvider();
    }
  }

  public async handleRequest(ctx: ApplicationRequestContext, next: () => Promise<void>, provider: string): Promise<void> {
    this.assertProvider(provider);
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

  public async handleCallback(ctx: ApplicationRequestContext, next: () => Promise<void>, provider: string): Promise<Identity> {
    this.assertProvider(provider);
    return new Promise((resolve, reject) => {
      this.passport.authenticate(provider, {
        scope: this.scopes[provider],
        session: false,
        failWithError: true,
        prompt: "consent",
      }, async (err: any|undefined, args: Omit<IdentityFederationCallbackArgs<any>, "scope"|"idp"|"logger">) => {
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
            throw new IAMErrors.IdentityNotExists();
          }
          resolve(identity);
        } catch (error) {
          reject(error);
        }
      })(ctx, next)
        .catch((err: any) => {
          reject(err);
        });
    });
  }
}

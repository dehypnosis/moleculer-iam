"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const koa_passport_1 = require("koa-passport");
const idp_1 = require("../../idp");
const error_1 = require("./error");
class IdentityFederationBuilder {
    constructor(builder) {
        this.builder = builder;
        this.scopes = {};
        this.callbacks = {};
        this.config = {};
        this._prefix = "/federate";
        this.getCallbackURL = (providerName) => this.builder.app.getURL(`${this._prefix}/${providerName}`, true);
        this.passport = new koa_passport_1.KoaPassport();
    }
    get prefix() {
        return this._prefix;
    }
    setCallbackPrefix(prefix) {
        this.builder.assertBuilding();
        this._prefix = prefix;
        this.builder.logger.info(`OIDC federation route path configured:`, `${this.builder.app.prefix}${prefix}/:path`);
        return this;
    }
    get providerNames() {
        this.builder.assertBuilding(true);
        return Object.keys(this.callbacks);
    }
    setProviderConfigurationMap(configMap) {
        this.builder.assertBuilding();
        this.config = { ...this.config, ...configMap };
        return this;
    }
    _dangerouslyBuild() {
        this.builder.assertBuilding();
        for (const [provider, options] of Object.entries(this.config)) {
            if (!options || !options.clientID) {
                continue;
            }
            // create strategy and apply
            const { scope, callback, strategy, ...restOptions } = options;
            this.scopes[provider] = typeof scope === "string" ? scope.split(" ").map(s => s.trim()).filter(s => !!s) : scope;
            this.callbacks[provider] = callback;
            const commonCallbackArgs = {
                scope: this.scopes[provider],
                idp: this.builder.idp,
                logger: this.builder.logger,
            };
            const callbackURL = this.getCallbackURL(provider);
            this.passport.use(strategy({
                ...restOptions,
                scope,
                callbackURL,
            }, async (accessToken, refreshToken, profile, next) => {
                this.builder.logger.info(`try identity federation from ${provider} with ${this.scopes[provider].join(", ")} scopes:`, profile);
                try {
                    next(null, {
                        accessToken,
                        profile,
                        ...commonCallbackArgs,
                    });
                }
                catch (error) {
                    next(error);
                }
            }));
            // remember scopes and callback handlers
            this.builder.logger.info(`enable identity federation from ${provider} with ${this.scopes[provider].join(", ")} scopes: ${callbackURL}`);
        }
    }
    assertProvider(provider) {
        if (!this.providerNames.includes(provider)) {
            throw new error_1.OIDCProviderProxyErrors.InvalidFederationProvider();
        }
    }
    async handleRequest(ctx, next, provider) {
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
    async handleCallback(ctx, next, provider) {
        this.assertProvider(provider);
        return new Promise((resolve, reject) => {
            this.passport.authenticate(provider, {
                scope: this.scopes[provider],
                session: false,
                failWithError: true,
                prompt: "consent",
            }, async (err, args) => {
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
                        throw new idp_1.IAMErrors.IdentityNotExistsError();
                    }
                    resolve(identity);
                }
                catch (error) {
                    reject(error);
                }
            })(ctx, next)
                .catch((err) => {
                reject(err);
            });
        });
    }
}
exports.IdentityFederationBuilder = IdentityFederationBuilder;
//# sourceMappingURL=federation.js.map
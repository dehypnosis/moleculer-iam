"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const koa_passport_1 = require("koa-passport");
const idp_1 = require("../../idp");
class IdentityFederationBuilder {
    constructor(builder) {
        this.builder = builder;
        this.scopes = {};
        this.callbacks = {};
        this.config = {};
        this._prefix = "/federate";
        this.getCallbackURL = (providerName) => this.builder.interaction.getURL(`${this._prefix}/${providerName}`);
        this.passport = new koa_passport_1.KoaPassport();
    }
    get prefix() {
        return this._prefix;
    }
    setCallbackPrefix(prefix) {
        this.builder.assertBuilding();
        this._prefix = prefix;
        this.builder.logger.info(`federation route path configured:`, `${this.builder.interaction.prefix}${prefix}/:path`);
        return this;
    }
    get providerNames() {
        this.builder.assertBuilding(true);
        return Object.keys(this.callbacks);
    }
    setProviderConfiguration(providerName, config) {
        this.builder.assertBuilding();
        this.config[providerName] = config;
        return this;
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
            const { clientID, scope, strategy, callback, ...customOptions } = options;
            this.scopes[provider] = typeof scope === "string" ? scope.split(" ").map(s => s.trim()).filter(s => !!s) : scope;
            this.callbacks[provider] = callback;
            const commonCallbackArgs = {
                scope: this.scopes[provider],
                idp: this.builder.idp,
                logger: this.builder.logger,
            };
            const callbackURL = this.getCallbackURL(provider);
            this.passport.use(strategy({
                ...customOptions,
                clientID,
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
    async handleRequest(ctx, next, provider) {
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
                        throw new idp_1.Errors.IdentityNotExistsError();
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
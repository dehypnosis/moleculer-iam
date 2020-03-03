"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const _ = tslib_1.__importStar(require("lodash"));
const koa_passport_1 = require("koa-passport");
const idp_1 = require("../../idp");
const federation_preset_1 = require("./federation.preset");
class IdentityFederationManager {
    constructor(builder, opts = {}) {
        this.builder = builder;
        this.scopes = {};
        this.callbacks = {};
        this.callbackURL = (providerName) => this.builder.interaction.url(`${this.prefix}/${providerName}`);
        this.passport = new koa_passport_1.KoaPassport();
        const { prefix = "/federate", ...providerOpts } = opts;
        this.prefix = prefix;
        const providerOptions = _.defaultsDeep(providerOpts, federation_preset_1.defaultIdentityFederationProviderOptions);
        for (const [provider, options] of Object.entries(providerOptions)) {
            if (!options || !options.clientID) {
                continue;
            }
            const { scope, callback, ...customProviderStrategyOptions } = options;
            this.scopes[provider] = typeof scope === "string" ? scope.split(" ").map(s => s.trim()).filter(s => !!s) : scope;
            this.callbacks[provider] = callback;
            const callbackURL = this.callbackURL(provider);
            this.builder.logger.info(`enable identity federation from ${provider} with ${this.scopes[provider].join(", ")} scopes: ${callbackURL}`);
            this.passport.use(new (federation_preset_1.defaultIdentityFederationProviderStrategies[provider])({
                ...customProviderStrategyOptions,
                callbackURL,
            }, async (accessToken, refreshToken, profile, done) => {
                try {
                    done(null, { accessToken, profile });
                }
                catch (error) {
                    done(error, null);
                }
            }));
        }
    }
    get providerNames() {
        return Object.keys(this.callbacks);
    }
    async request(ctx, next, provider) {
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
    async callback(ctx, next, provider) {
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
exports.IdentityFederationManager = IdentityFederationManager;
//# sourceMappingURL=federation.js.map
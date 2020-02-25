"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const _ = tslib_1.__importStar(require("lodash"));
const koa_passport_1 = require("koa-passport");
const error_1 = require("../../identity/error");
const federation_presets_1 = require("./federation.presets");
tslib_1.__exportStar(require("./federation.presets"), exports);
class IdentityFederationManager {
    constructor(props, opts = {}) {
        this.props = props;
        this.scopes = {};
        this.callbacks = {};
        this.logger = props.logger || console;
        this.passport = new koa_passport_1.KoaPassport();
        opts = _.defaultsDeep(opts, federation_presets_1.defaultIdentityFederationManagerOptions);
        for (const [provider, options] of Object.entries(opts)) {
            if (!options || !options.clientID) {
                continue;
            }
            const callbackURL = props.callbackURL(provider);
            const { scope, callback, ...providerOpts } = options;
            this.scopes[provider] = typeof scope === "string" ? scope.split(" ").map(s => s.trim()).filter(s => !!s) : scope;
            this.callbacks[provider] = callback;
            this.logger.info(`enable identity federation from ${provider} with ${this.scopes[provider].join(", ")} scopes: ${callbackURL}`);
            this.passport.use(new (federation_presets_1.Strategies[provider])({
                ...providerOpts,
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
    get availableProviders() {
        return Object.keys(this.scopes);
    }
    async request(provider, ctx, next) {
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
    async callback(provider, ctx, next) {
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
                        idp: this.props.idp,
                        logger: this.logger,
                        scope: this.scopes[provider],
                        ...args,
                    });
                    if (!identity) {
                        throw new error_1.Errors.IdentityNotExistsError();
                    }
                    resolve(identity);
                }
                catch (error) {
                    this.logger.error(error);
                    reject(error);
                }
            })(ctx, next)
                .catch((err) => {
                this.logger.error(err);
                reject(err);
            });
        });
    }
}
exports.IdentityFederationManager = IdentityFederationManager;
//# sourceMappingURL=federation.js.map
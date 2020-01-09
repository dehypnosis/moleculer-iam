"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const _ = tslib_1.__importStar(require("lodash"));
const identity_1 = require("./identity");
const error_1 = require("./error");
const adapter_1 = require("./adapter");
const claims_1 = require("./claims");
const validator_1 = require("../validator");
class IdentityProvider {
    constructor(props, opts) {
        this.props = props;
        /* lifecycle */
        this.working = false;
        /* fetch account */
        // args will be like { claims:{}, metadata:{}, ...}
        this.validateEmailOrPhoneNumber = validator_1.validator.compile({
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
        });
        this.logger = props.logger || console;
        const options = _.defaultsDeep(opts || {}, {
            adapter: {
                type: "Memory",
                options: {},
            },
        });
        // create adapter
        if (options.adapter instanceof adapter_1.IDPAdapter) {
            this.adapter = options.adapter;
        }
        else {
            const adapterKey = Object.keys(adapter_1.IDPAdapterConstructors).find(k => k.toLowerCase() === (options.adapter.type || "").toLowerCase())
                || Object.keys(adapter_1.IDPAdapterConstructors)[0];
            this.adapter = new adapter_1.IDPAdapterConstructors[adapterKey]({
                logger: this.logger,
            }, options.adapter.options);
        }
        // create claims manager
        this.claims = new claims_1.IdentityClaimsManager({
            logger: this.logger,
            adapter: this.adapter,
        }, options.claims);
    }
    start() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this.working) {
                return;
            }
            // start adapter
            yield this.adapter.start();
            // start claims manager
            yield this.claims.start();
            this.logger.info("identity provider has been started");
            this.working = true;
        });
    }
    stop() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!this.working) {
                return;
            }
            // stop claims manager
            yield this.claims.stop();
            // stop adapter
            yield this.adapter.stop();
            this.logger.info("identity provider has been stopped");
            this.working = false;
        });
    }
    find(args) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const where = args;
            // set softDeleted=false
            if (!where.metadata || typeof where.metadata === "undefined" || Object.keys(where.metadata).length === 0) {
                if (!where.metadata)
                    where.metadata = {};
                where.metadata.softDeleted = false;
            }
            // validate args to normalize email and phone number
            if (where.claims) {
                const result = this.validateEmailOrPhoneNumber(where.claims);
                if (result !== true) {
                    throw new error_1.Errors.ValidationError(result);
                }
            }
            return this.adapter.find(where).then(id => id ? new identity_1.Identity({ id, provider: this }) : undefined);
        });
    }
    findOrFail(args) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const identity = yield this.find(args);
            if (!identity) {
                throw new error_1.Errors.IdentityNotExistsError();
            }
            return identity;
        });
    }
    // args will be like { claims:{}, metadata:{}, ...}
    count(args) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const where = args || {};
            // set softDeleted=false
            if (!where.metadata || typeof where.metadata === "undefined" || Object.keys(where.metadata).length === 0) {
                if (!where.metadata)
                    where.metadata = {};
                where.metadata.softDeleted = false;
            }
            // validate args to normalize email and phone number
            if (where.claims) {
                const result = this.validateEmailOrPhoneNumber(where.claims);
                if (result !== true) {
                    throw new error_1.Errors.ValidationError(result);
                }
            }
            return this.adapter.count(where);
        });
    }
    // args will be like { where: { claims:{}, metadata:{}, ...}, offset: 0, limit: 100, ... }
    get(args) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            args = Object.assign({ offset: 0, limit: 10 }, args);
            if (typeof args.where === "object" && args.where !== null) {
                const where = args.where;
                // set softDeleted=false
                if (!where.metadata || typeof where.metadata === "undefined" || Object.keys(where.metadata).length === 0) {
                    if (!where.metadata)
                        where.metadata = {};
                    where.metadata.softDeleted = false;
                }
                // validate args to normalize email and phone number
                if (where.claims) {
                    const result = this.validateEmailOrPhoneNumber(where.claims);
                    if (result !== true) {
                        throw new error_1.Errors.ValidationError(result);
                    }
                }
            }
            return this.adapter.get(args)
                .then(ids => ids.map(id => new identity_1.Identity({ id, provider: this })));
        });
    }
    /* create account */
    create(args) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (typeof args.scope === "string") {
                args = Object.assign(Object.assign({}, args), { scope: args.scope.split(" ").filter(s => !!s) });
            }
            else if (typeof args.scope === "undefined") {
                args = Object.assign(Object.assign({}, args), { scope: [] });
            }
            // push mandatory scopes
            args.scope = [...new Set([...args.scope, ...this.claims.mandatoryScopes])];
            return this.adapter.create(args)
                .then(id => new identity_1.Identity({ id, provider: this }));
        });
    }
    validate(args) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (typeof args.scope === "string") {
                args = Object.assign(Object.assign({}, args), { scope: args.scope.split(" ").filter(s => !!s) });
            }
            else if (typeof args.scope === "undefined") {
                args = Object.assign(Object.assign({}, args), { scope: [] });
            }
            return this.adapter.validate(args);
        });
    }
    validateCredentials(credentials) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.adapter.validateCredentials(credentials);
        });
    }
}
exports.IdentityProvider = IdentityProvider;
//# sourceMappingURL=provider.js.map
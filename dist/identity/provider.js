"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const _ = tslib_1.__importStar(require("lodash"));
const error_1 = require("./error");
const adapter_1 = require("./adapter");
const claims_1 = require("./claims");
const validator_1 = require("../validator");
const uuid_1 = tslib_1.__importDefault(require("uuid"));
class IdentityProvider {
    constructor(props, opts) {
        this.props = props;
        /* lifecycle */
        this.working = false;
        /* fetch account */
        // args will be like { claims:{}, metadata:{}, ...}
        this.validateEmailOrPhoneNumber = validator_1.validator.compile({
            email: {
                type: "email",
                normalize: true,
                optional: true,
            },
            phone_number: {
                type: "phone",
                optional: true,
            },
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
            // set softDeleted=false
            if (!args.metadata || typeof args.metadata === "undefined") {
                if (!args.metadata)
                    args.metadata = {};
                args.metadata.softDeleted = false;
            }
            // validate args to normalize email and phone number
            if (args.claims) {
                const result = this.validateEmailOrPhoneNumber(args.claims);
                if (result !== true) {
                    throw new error_1.Errors.ValidationError(result);
                }
            }
            return this.adapter.find(args);
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
            // set softDeleted=false
            if (!args || !args.metadata || typeof args.metadata === "undefined") {
                if (!args)
                    args = {};
                if (!args.metadata)
                    args.metadata = {};
                args.metadata.softDeleted = false;
            }
            return this.adapter.count(args);
        });
    }
    // args will be like { where: { claims:{}, metadata:{}, ...}, offset: 0, limit: 100, ... }
    get(args) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            args = Object.assign({ offset: 0, limit: 10 }, args);
            // set softDeleted=false
            if (!args.where || !args.where.metadata || typeof args.where.metadata === "undefined") {
                if (!args.where)
                    args.where = {};
                if (!args.where.metadata)
                    args.where.metadata = {};
                args.where.metadata.softDeleted = false;
            }
            return this.adapter.get(args);
        });
    }
    /* create account */
    create(args) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (args.claims && !args.claims.sub) {
                args.claims.sub = uuid_1.default.v4();
            }
            if (typeof args.scope === "string") {
                args.scope = args.scope.split(" ").map(s => s.trim()).filter(s => !!s);
            }
            // push mandatory scopes
            args.scope = [...new Set([...args.scope, ...this.claims.mandatoryScopes])];
            return this.adapter.create(args);
        });
    }
    validate(args) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (typeof args.scope === "string") {
                args.scope = args.scope.split(" ").map(s => s.trim()).filter(s => !!s);
            }
            return this.adapter.validate(args);
        });
    }
}
exports.IdentityProvider = IdentityProvider;
//# sourceMappingURL=provider.js.map
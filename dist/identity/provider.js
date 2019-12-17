"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const _ = tslib_1.__importStar(require("lodash"));
const error_1 = require("./error");
const adapter_1 = require("./adapter");
const claims_1 = require("./claims");
const validator_1 = require("../validator");
class IdentityProvider {
    constructor(props, opts) {
        this.props = props;
        /* lifecycle */
        this.working = false;
        this.logger = props.logger || console;
        const options = _.defaultsDeep(opts || {}, {
            adapter: {
                type: "Memory",
                options: {},
            },
            claims: [],
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
            // create dummies
            yield this.create({
                metadata: { federation: {}, softDeleted: false },
                scope: "openid email profile phone".split(" "),
                claims: {
                    sub: "1",
                    email: "test@test.com",
                    name: "tester kim",
                    phone_number: "010-4477-6418",
                    phone_number_verified: false,
                },
                credentials: {
                    password: "1234",
                },
            });
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
    /* fetch account */
    find(args, metadata = { softDeleted: false }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            // validate args to normalize email and phone number
            const result = validator_1.validator.validate(args, {
                id: {
                    type: "string",
                    optional: true,
                },
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
            if (result !== true) {
                throw new error_1.Errors.ValidationError(result);
            }
            const identity = yield this.adapter.find(args, metadata);
            if (!identity)
                throw new error_1.Errors.IdentityNotExistsError();
            return identity;
        });
    }
    get(args, metadata = { softDeleted: false }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.adapter.get(Object.assign({ offset: 0, limit: 10 }, args), metadata);
        });
    }
    count(args = {}, metadata = { softDeleted: false }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.adapter.count(args, metadata);
        });
    }
    /* create account */
    create(args) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            // push mandatory scopes
            args.scope = [...new Set([...args.scope, ...this.claims.mandatoryScopes])];
            return this.adapter.create(args);
        });
    }
}
exports.IdentityProvider = IdentityProvider;
//# sourceMappingURL=provider.js.map
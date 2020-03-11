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
    async start() {
        if (this.working) {
            return;
        }
        // start adapter
        await this.adapter.start();
        // start claims manager
        await this.claims.start();
        this.logger.info("identity provider has been started");
        this.working = true;
    }
    async stop() {
        if (!this.working) {
            return;
        }
        // stop claims manager
        await this.claims.stop();
        // stop adapter
        await this.adapter.stop();
        this.logger.info("identity provider has been stopped");
        this.working = false;
    }
    async find(args) {
        const where = args;
        // set softDeleted=false
        if (!where.metadata || typeof where.metadata === "undefined" || Object.keys(where.metadata).length === 0) {
            if (!where.metadata)
                where.metadata = {};
            where.metadata.softDeleted = false;
        }
        // validate args to normalize email and phone number
        if (where.claims) {
            this.validateEmailOrPhoneNumber(where.claims);
            // const result =
            // if (result !== true) {
            //   throw new (Errors.ValidationError)(result);
            // }
        }
        return this.adapter.find(where).then(id => id ? new identity_1.Identity({ id, provider: this }) : undefined);
    }
    async findOrFail(args) {
        const identity = await this.find(args);
        if (!identity) {
            throw new error_1.Errors.IdentityNotExistsError();
        }
        return identity;
    }
    // args will be like { claims:{}, metadata:{}, ...}
    async count(args) {
        const where = args || {};
        // set softDeleted=false
        if (!where.metadata || typeof where.metadata === "undefined" || Object.keys(where.metadata).length === 0) {
            if (!where.metadata)
                where.metadata = {};
            where.metadata.softDeleted = false;
        }
        // validate args to normalize email and phone number
        if (where.claims) {
            this.validateEmailOrPhoneNumber(where.claims);
            // const result =
            // if (result !== true) {
            //   throw new Errors.ValidationError(result);
            // }
        }
        return this.adapter.count(where);
    }
    // args will be like { where: { claims:{}, metadata:{}, ...}, offset: 0, limit: 100, ... }
    async get(args) {
        args = { offset: 0, limit: 10, ...args };
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
                this.validateEmailOrPhoneNumber(where.claims);
                // const result =
                // if (result !== true) {
                //   throw new Errors.ValidationError(result);
                // }
            }
        }
        return this.adapter.get(args)
            .then(ids => ids.map(id => new identity_1.Identity({ id, provider: this })));
    }
    /* create account */
    async create(args, transaction, ignoreUndefinedClaims) {
        if (typeof args.scope === "string") {
            args = { ...args, scope: args.scope.split(" ").filter(s => !!s) };
        }
        else if (typeof args.scope === "undefined") {
            args = { ...args, scope: [] };
        }
        // push mandatory scopes
        args.scope = [...new Set([...args.scope, ...this.claims.mandatoryScopes])];
        return this.adapter.create(args, transaction, ignoreUndefinedClaims)
            .then(id => new identity_1.Identity({ id, provider: this }));
    }
    async validate(args) {
        if (typeof args.scope === "string") {
            args = { ...args, scope: args.scope.split(" ").filter(s => !!s) };
        }
        else if (typeof args.scope === "undefined") {
            args = { ...args, scope: [] };
        }
        return this.adapter.validate(args);
    }
    async validateCredentials(credentials) {
        return this.adapter.validateCredentials(credentials);
    }
}
exports.IdentityProvider = IdentityProvider;
//# sourceMappingURL=idp.js.map
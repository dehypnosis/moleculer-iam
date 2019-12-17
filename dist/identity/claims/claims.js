"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const _ = tslib_1.__importStar(require("lodash"));
const vm = tslib_1.__importStar(require("vm"));
const object_hash_1 = tslib_1.__importDefault(require("object-hash"));
const validator_1 = require("../../validator");
const error_1 = require("../error");
const types_1 = require("./types");
class IdentityClaimsManager {
    constructor(props, opts) {
        this.props = props;
        this.logger = props.logger || console;
        // compile payload validation functions
        this.validatePayload = validator_1.validator.compile(types_1.IdentityClaimsSchemaPayloadValidationSchema);
        // prepare base claims
        this.options = _.defaultsDeep(opts || {}, {
            baseClaims: [
                {
                    scope: "profile",
                    key: "name",
                    validation: "string",
                },
                {
                    scope: "profile",
                    key: "picture",
                    validation: {
                        type: "string",
                        optional: true,
                    },
                },
                {
                    scope: "email",
                    key: "email",
                    validation: {
                        type: "email",
                        normalize: true,
                    },
                },
                {
                    scope: "email",
                    key: "email_verified",
                    validation: {
                        type: "boolean",
                        default: false,
                    },
                },
                {
                    scope: "phone",
                    key: "phone_number",
                    validation: {
                        type: "phone",
                        country: "KR",
                    },
                },
                {
                    scope: "phone",
                    key: "phone_number_verified",
                    validation: {
                        type: "boolean",
                        default: false,
                    },
                },
            ],
            mandatoryScopes: [
                "openid",
                "profile",
                "email",
            ],
        });
    }
    /* lifecycle */
    start() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            // define mandatory claims and base claims
            const payloads = [
                {
                    scope: "openid",
                    key: "sub",
                    description: "account id",
                    validation: "string",
                },
                ...this.options.baseClaims,
            ];
            yield Promise.all(payloads.map(payload => this.defineClaimsSchema(payload)));
            this.logger.info("identity claims manager has been started");
        });
    }
    stop() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.logger.info("identity claims manager has been stopped");
        });
    }
    /* to update claims schema */
    hashClaimsSchemaPayload(payload) {
        return object_hash_1.default(payload, {
            algorithm: "md5",
            unorderedArrays: true,
            unorderedObjects: true,
            unorderedSets: true,
        });
    }
    createClaimsSchema(payload) {
        const result = this.validatePayload(payload);
        if (result !== true) {
            throw new error_1.Errors.ValidationError(result, {
                payload,
            });
        }
        const schema = Object.assign(Object.assign({}, payload), { version: this.hashClaimsSchemaPayload(payload), active: true });
        return schema;
    }
    compileClaimsValidator(schema) {
        const validate = validator_1.validator.compile({
            [schema.key]: schema.validation,
            $$strict: true,
        });
        return (claims) => {
            const result = validate({ [schema.key]: claims });
            if (result !== true) {
                throw new error_1.Errors.ValidationError(result, {
                    [schema.key]: claims,
                });
            }
        };
    }
    compileClaimsMigrationStrategy(schema) {
        // compile function
        try {
            const script = new vm.Script(`(${schema.migration})(oldClaim, seedClaim, claims)`, {
                displayErrors: true,
                timeout: 100,
            });
            return (oldClaim, seedClaim, claims) => {
                return script.runInNewContext({ oldClaim, seedClaim: _.cloneDeep(seedClaim), claims });
            };
        }
        catch (error) {
            throw new error_1.Errors.ValidationError([], { migration: schema.migration, error });
        }
    }
    get mandatoryScopes() {
        return [...new Set(this.options.mandatoryScopes.concat(["openid"]))];
    }
    getActiveClaimsSchemata() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.props.adapter.getClaimsSchemata({ scope: [], active: true });
        });
    }
    defineClaimsSchema(payload) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.props.adapter.acquireMigrationLock(payload.key);
            try {
                // validate payload and create schema
                const schema = this.createClaimsSchema(payload);
                // compile claims schema and validate it with default value
                const validateClaims = this.compileClaimsValidator(schema);
                // compile migration function
                const migrateClaims = this.compileClaimsMigrationStrategy(schema);
                // restore inactive schema version if does
                const inactiveSchema = yield this.props.adapter.getClaimsSchema({ key: schema.key, version: schema.version, active: false });
                if (inactiveSchema) {
                    yield this.props.adapter.setActiveClaimsSchema({ key: schema.key, version: schema.version });
                    this.logger.info(`activate identity claims schema for ${schema.key}:${schema.version.substr(0, 8)}`);
                    // clear cache
                    if (this.props.adapter.clearClaimsCache) {
                        yield this.props.adapter.clearClaimsCache();
                    }
                    return schema;
                }
                // get current active schema
                const activeSchema = yield this.props.adapter.getClaimsSchema({ key: schema.key, active: true });
                // if has exactly same schema
                if (activeSchema && activeSchema.version === schema.version) {
                    this.logger.info(`skip identity claims schema migration for ${activeSchema.key}:${activeSchema.version.substr(0, 8)}`);
                    return activeSchema;
                }
                // get target schema
                let parentSchema;
                if (schema.parentVersion) { // from specific version
                    parentSchema = yield this.props.adapter.getClaimsSchema({ key: schema.key, version: schema.parentVersion });
                    if (!parentSchema) {
                        throw new error_1.Errors.ValidationError([], { parentVersion: schema.parentVersion });
                    }
                }
                else {
                    parentSchema = activeSchema;
                    schema.parentVersion = parentSchema ? parentSchema.version : undefined;
                }
                // update user client claims
                this.logger.debug(`start identity claims migration: ${schema.key}:${schema.parentVersion ? schema.parentVersion.substr(0, 8) + " -> " : ""}${schema.version.substr(0, 8)}`);
                try {
                    // begin transaction
                    yield this.props.adapter.beginMigration(schema.key);
                    // create new claims schema
                    yield this.props.adapter.putClaimsSchema(schema, schema.key);
                    yield this.props.adapter.setActiveClaimsSchema({ key: schema.key, version: schema.version }, schema.key);
                    // migrate in batches
                    const limit = 100;
                    let offset = 0;
                    let index = 0;
                    while (true) {
                        const identities = yield this.props.adapter.get({ offset, limit }, { softDeleted: undefined });
                        for (const identity of identities) {
                            // validate new claims and save
                            let oldClaim;
                            let newClaim;
                            let claims;
                            try {
                                // create new value
                                claims = yield identity.claims();
                                oldClaim = parentSchema
                                    ? yield this.props.adapter.getClaimsVersion(identity, [{
                                            key: schema.key,
                                            schemaVersion: schema.version,
                                        }])
                                        .then(result => result[schema.key])
                                    : undefined;
                                oldClaim = typeof oldClaim === "undefined" ? null : oldClaim;
                                newClaim = migrateClaims(oldClaim, schema.seed, claims);
                                newClaim = typeof newClaim === "undefined" ? null : newClaim;
                                this.logger.debug(`migrate user claims ${identity.id}:${schema.key}:${schema.version.substr(0, 8)}`, oldClaim, "->", newClaim);
                                // validate and store it
                                validateClaims(newClaim);
                                yield this.props.adapter.putClaimsVersion(identity, [{
                                        key: schema.key,
                                        value: newClaim,
                                        schemaVersion: schema.version,
                                    }], schema.key);
                            }
                            catch (error) {
                                const detail = { id: identity.id, oldClaim, newClaim, error, index };
                                this.logger.error("failed to update user claims", detail);
                                throw new error_1.Errors.ValidationError([], detail);
                            }
                            index++;
                        }
                        if (identities.length === 0) {
                            break;
                        }
                        offset += limit;
                    }
                    // commit transaction
                    yield this.props.adapter.commitMigration(schema.key);
                    // clear cache
                    if (this.props.adapter.clearClaimsCache) {
                        yield this.props.adapter.clearClaimsCache();
                    }
                    this.logger.info(`identity claims migration finished: ${schema.key}:${schema.parentVersion ? schema.parentVersion.substr(0, 8) + " -> " : ""}${schema.version.substr(0, 8)}`);
                    return schema;
                }
                catch (error) { // failed to migrate, revoke migration
                    this.logger.error(`identity claims migration failed`, error);
                    // rollback transaction
                    yield this.props.adapter.rollbackMigration(schema.key);
                    throw error;
                }
            }
            finally {
                yield this.props.adapter.releaseMigrationLock(payload.key);
            }
        });
    }
}
exports.IdentityClaimsManager = IdentityClaimsManager;
//# sourceMappingURL=claims.js.map
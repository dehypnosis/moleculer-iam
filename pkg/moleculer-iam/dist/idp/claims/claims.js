"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const _ = tslib_1.__importStar(require("lodash"));
const vm = tslib_1.__importStar(require("vm"));
const terser_1 = tslib_1.__importDefault(require("terser"));
const object_hash_1 = tslib_1.__importDefault(require("object-hash"));
const validator_1 = require("../../helper/validator");
const error_1 = require("../error");
const types_1 = require("./types");
const options_1 = require("./options");
class IdentityClaimsManager {
    constructor(props, opts) {
        this.props = props;
        this.mandatoryScopes = [];
        this._supportedScopes = {};
        this.logger = props.logger || console;
        // compile payload validation functions
        this.validatePayload = validator_1.validator.compile(types_1.IdentityClaimsSchemaPayloadValidationSchema);
        // prepare base claims
        this.options = _.defaultsDeep(opts || {}, options_1.defaultIdentityClaimsManagerOptions);
        this.mandatoryScopes = [...new Set(this.options.mandatoryScopes.concat(["openid"]))];
    }
    get adapter() {
        return this.props.adapter;
    }
    /* lifecycle */
    async start() {
        // define mandatory claims and base claims
        const payloads = [
            {
                scope: "openid",
                key: "sub",
                description: "account id",
                validation: "string",
                immutable: true,
                unique: true,
            },
            ...this.options.baseClaims,
        ];
        for (const payload of payloads) {
            await this.defineClaimsSchema(payload);
        }
        await this.syncSupportedScopes();
        this.logger.info("identity claims manager has been started");
    }
    async stop() {
        this.logger.info("identity claims manager has been stopped");
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
        // normalize migration codes
        const { code, error } = terser_1.default.minify(`(${payload.migration})(oldClaim, claims);`, { ecma: 6, compress: false, mangle: false, output: { beautify: true, indent_level: 2 } });
        if (error) {
            throw error;
        }
        payload.migration = code;
        const schema = {
            ...payload,
            version: this.hashClaimsSchemaPayload(payload),
            active: true,
        };
        return schema;
    }
    compileClaimsValidator(schema) {
        const validate = validator_1.validator.compile({
            [schema.key]: schema.validation,
            $$strict: true,
        });
        return (claims) => {
            const result = validate(claims);
            if (result !== true) {
                throw new error_1.Errors.ValidationError(result, claims);
            }
        };
    }
    compileClaimsMigrationStrategy(schema) {
        // compile function
        try {
            const script = new vm.Script(schema.migration, {
                displayErrors: true,
                timeout: 100,
            });
            // uncomment to read function codes on jest cov_ errors
            // console.log(`(${schema.migration!})(oldClaim, claims)`);
            return (oldClaim, claims) => {
                return script.runInNewContext({ oldClaim, claims });
            };
        }
        catch (error) {
            throw new error_1.Errors.ValidationError([], { migration: schema.migration, error });
        }
    }
    get supportedScopes() {
        return this._supportedScopes;
    }
    async syncSupportedScopes() {
        // update supported scope information
        this._supportedScopes = await this.getActiveClaimsSchemata()
            .then(schemata => schemata.reduce((scopes, schema) => {
            scopes[schema.scope] = (scopes[schema.scope] || []).concat(schema.key);
            return scopes;
        }, {}));
    }
    async onClaimsSchemaUpdated() {
        await this.adapter.onClaimsSchemaUpdated();
        await this.syncSupportedScopes();
        return;
    }
    async getActiveClaimsSchemata() {
        return this.adapter.getClaimsSchemata({ scope: [], active: true });
    }
    async getClaimsSchemata(args) {
        if (typeof args.scope === "string") {
            args = { ...args, scope: args.scope.split(" ").filter(s => !!s) };
        }
        else if (typeof args.scope === "undefined") {
            args = { ...args, scope: [] };
        }
        return this.adapter.getClaimsSchemata(args);
    }
    async getClaimsSchema(args) {
        return this.adapter.getClaimsSchema(args);
    }
    async forceReloadClaims(args) {
        this.logger.info(`force reload identity claims: onClaimsUpdated()`, args);
        let transaction;
        try {
            transaction = await this.adapter.transaction();
            // search and reload
            if (args.where) {
                // migrate in batches
                const limit = 100;
                let offset = 0;
                while (true) {
                    const ids = await this.adapter.get({ where: args.where, offset, limit });
                    if (ids.length === 0) {
                        break;
                    }
                    await Promise.all(ids.map(async (id) => {
                        try {
                            await this.adapter.onClaimsUpdated(id, {}, transaction);
                        }
                        catch (error) {
                            this.logger.error("failed to reload user claims", id, error);
                            throw error;
                        }
                    }));
                    offset += limit;
                }
            }
            // reload directly
            if (args.ids && args.ids.length > 0) {
                await Promise.all(args.ids.map(async (id) => {
                    try {
                        await this.adapter.onClaimsUpdated(id, {}, transaction);
                    }
                    catch (error) {
                        this.logger.error("failed to reload user claims", id, error);
                        throw error;
                    }
                }));
            }
            await transaction.commit();
        }
        catch (error) {
            this.logger.error(`force reload identity claims failed`, error);
            if (transaction) {
                await transaction.rollback();
            }
            throw error;
        }
    }
    async forceDeleteClaimsSchemata(...keys) {
        for (const key of keys) {
            await this.adapter.acquireMigrationLock(key);
            const transaction = await this.adapter.transaction();
            try {
                this.logger.info("force delete claims schema:", key);
                await this.adapter.forceDeleteClaimsSchema(key, transaction);
                await this.adapter.onClaimsSchemaUpdated();
                await transaction.commit();
            }
            catch (error) {
                this.logger.error("failed to force delete claims schema:", key);
                await transaction.rollback();
                throw error;
            }
            finally {
                await this.adapter.releaseMigrationLock(key);
            }
        }
    }
    async defineClaimsSchema(payload) {
        await this.adapter.acquireMigrationLock(payload.key);
        try {
            // validate payload and create schema
            const schema = this.createClaimsSchema(payload);
            const scopeFilter = { metadata: { scope: { [schema.scope]: true } } };
            // compile claims schema and validate it with default value
            const validateClaims = this.compileClaimsValidator(schema);
            // compile migration function
            const migrateClaims = this.compileClaimsMigrationStrategy(schema);
            // restore inactive schema version if does
            const inactiveSchema = await this.adapter.getClaimsSchema({ key: schema.key, version: schema.version, active: false });
            if (inactiveSchema) {
                this.logger.info(`activate identity claims schema for ${schema.key}:${schema.version.substr(0, 8)}`);
                // tslint:disable-next-line:no-shadowed-variable
                const transaction = await this.adapter.transaction();
                try {
                    // activate
                    await this.adapter.setActiveClaimsSchema({ key: schema.key, version: schema.version }, transaction);
                    // migrate in batches
                    const limit = 100;
                    let offset = 0;
                    while (true) {
                        const identities = await this.adapter.get({ offset, limit, where: scopeFilter });
                        if (identities.length === 0) {
                            break;
                        }
                        await Promise.all(identities.map(async (identity) => {
                            try {
                                await this.adapter.onClaimsUpdated(identity, {}, transaction);
                            }
                            catch (error) {
                                this.logger.error("failed to update user claims", error);
                                throw error;
                            }
                        }));
                        // notice current migration is alive
                        if (this.adapter.touchMigrationLock) {
                            await this.adapter.touchMigrationLock(schema.key, offset + identities.length);
                        }
                        offset += limit;
                    }
                    await this.adapter.onClaimsSchemaUpdated();
                    await transaction.commit();
                    return schema;
                }
                catch (error) {
                    this.logger.error(`identity claims migration failed`, error);
                    await transaction.rollback();
                    throw error;
                }
            }
            // get current active schema
            const activeSchema = await this.adapter.getClaimsSchema({ key: schema.key, active: true });
            // if has exactly same schema
            if (activeSchema && activeSchema.version === schema.version) {
                this.logger.info(`skip identity claims schema migration for ${activeSchema.key}:${activeSchema.version.substr(0, 8)}`);
                await this.adapter.onClaimsSchemaUpdated(); // for the case of distributed system
                return activeSchema;
            }
            // get target schema
            let parentSchema;
            if (schema.parentVersion) { // from specific version
                parentSchema = await this.adapter.getClaimsSchema({ key: schema.key, version: schema.parentVersion });
                if (!parentSchema) {
                    throw new error_1.Errors.ValidationError([], { parentVersion: schema.parentVersion });
                }
            }
            else {
                parentSchema = activeSchema;
                schema.parentVersion = parentSchema ? parentSchema.version : undefined;
            }
            // update user client claims
            this.logger.info(`start identity claims migration: ${schema.key}:${schema.parentVersion ? schema.parentVersion.substr(0, 8) + " -> " : ""}${schema.version.substr(0, 8)}`);
            // begin transaction
            const transaction = await this.adapter.transaction();
            try {
                // create new claims schema
                await this.adapter.createClaimsSchema(schema, transaction);
                await this.adapter.setActiveClaimsSchema({ key: schema.key, version: schema.version }, transaction);
                // migrate in batches
                const limit = 100;
                let offset = 0;
                while (true) {
                    const ids = await this.adapter.get({ offset, limit, where: scopeFilter });
                    if (ids.length === 0) {
                        break;
                    }
                    await Promise.all(ids.map(async (id, index) => {
                        // validate new claims and save
                        let oldClaim;
                        let newClaim;
                        let claims;
                        try {
                            // create new value
                            claims = await this.adapter.getClaims(id, []);
                            oldClaim = parentSchema
                                ? await this.adapter.getVersionedClaims(id, [{
                                        key: schema.key,
                                        schemaVersion: schema.parentVersion,
                                    }])
                                    .then(result => result[schema.key])
                                : undefined;
                            oldClaim = typeof oldClaim === "undefined" ? null : oldClaim;
                            newClaim = migrateClaims(oldClaim, claims);
                            newClaim = typeof newClaim === "undefined" ? null : newClaim;
                            // validate and re-assign (may) sanitized value
                            const newClaims = { [schema.key]: newClaim };
                            validateClaims(newClaims); // in migration, schema.unique property is ignored
                            newClaim = newClaims[schema.key];
                            this.logger.info(`migrate user claims ${id}:${schema.key}:${schema.version.substr(0, 8)}`, oldClaim, "->", newClaim);
                            await this.adapter.createOrUpdateVersionedClaims(id, [{
                                    key: schema.key,
                                    value: newClaim,
                                    schemaVersion: schema.version,
                                }], transaction);
                            if (JSON.stringify(oldClaim) !== JSON.stringify(newClaim)) {
                                await this.adapter.onClaimsUpdated(id, { [schema.key]: newClaim }, transaction);
                            }
                        }
                        catch (error) {
                            const detail = { id, oldClaim, newClaim, error, index: index + offset };
                            this.logger.error("failed to update user claims", detail);
                            throw new error_1.Errors.ValidationError([], detail);
                        }
                    }));
                    // notice current migration is alive
                    if (this.adapter.touchMigrationLock) {
                        await this.adapter.touchMigrationLock(schema.key, offset + ids.length);
                    }
                    offset += limit;
                }
                // commit transaction
                await this.adapter.onClaimsSchemaUpdated();
                await transaction.commit();
                this.logger.info(`identity claims migration finished: ${schema.key}:${schema.parentVersion ? schema.parentVersion.substr(0, 8) + " -> " : ""}${schema.version.substr(0, 8)}`);
                return schema;
            }
            catch (error) { // failed to migrate, revoke migration
                this.logger.error(`identity claims migration failed:`, error);
                await transaction.rollback();
                throw error;
            }
        }
        finally {
            await this.adapter.releaseMigrationLock(payload.key);
        }
    }
}
exports.IdentityClaimsManager = IdentityClaimsManager;
//# sourceMappingURL=claims.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const _ = tslib_1.__importStar(require("lodash"));
const kleur_1 = tslib_1.__importDefault(require("kleur"));
const metadata_1 = require("../metadata");
const validator_1 = require("../../helper/validator");
const error_1 = require("../error");
const uuid_1 = tslib_1.__importDefault(require("uuid"));
class IDPAdapter {
    constructor(props, options) {
        this.props = props;
        this.getCachedActiveClaimsSchemata = _.memoize(async (scope) => {
            // get schemata
            const claimsSchemata = await this.getClaimsSchemata({ scope, active: true });
            const activeClaimsVersions = claimsSchemata.reduce((obj, schema) => {
                obj[schema.key] = schema.version;
                return obj;
            }, {});
            const validClaimsKeys = claimsSchemata.map(s => s.key);
            // get unique claims schemata
            const uniqueClaimsSchemata = claimsSchemata.filter(s => s.unique);
            const uniqueClaimsSchemataKeys = uniqueClaimsSchemata.map(s => s.key);
            const validateClaimsUniqueness = async (id, object) => {
                if (uniqueClaimsSchemata.length === 0)
                    return true;
                const errors = [];
                for (const key of uniqueClaimsSchemataKeys) {
                    const value = object[key];
                    const holderId = await this.find({ claims: { [key]: value } });
                    if (holderId && id !== holderId) {
                        errors.push(validator_1.createValidationError({
                            type: "duplicate",
                            field: key,
                            actual: value,
                        }));
                    }
                }
                return errors.length > 0 ? errors : true;
            };
            // get immutable claims schemata
            const immutableClaimsSchemata = claimsSchemata.filter(s => s.immutable);
            const immutableClaimsSchemataScope = immutableClaimsSchemata.map(s => s.scope);
            const immutableClaimsSchemataKeys = immutableClaimsSchemata.map(s => s.key);
            const validateClaimsImmutability = async (id, object) => {
                if (immutableClaimsSchemata.length === 0)
                    return true;
                const errors = [];
                const oldClaims = await this.getClaims(id, immutableClaimsSchemataScope);
                for (const key of immutableClaimsSchemataKeys) {
                    const oldValue = oldClaims[key];
                    const newValue = object[key];
                    if (typeof newValue !== "undefined" && typeof oldValue !== "undefined" && oldValue !== null && oldValue !== newValue) {
                        errors.push({
                            type: "immutable",
                            field: key,
                            message: `The '${key}' field value cannot be updated.`,
                            actual: newValue,
                            expected: oldValue,
                        });
                    }
                }
                return errors.length > 0 ? errors : true;
            };
            // prepare to validate and merge old claims
            const claimsValidationSchema = claimsSchemata.reduce((obj, claimsSchema) => {
                obj[claimsSchema.key] = claimsSchema.validation;
                return obj;
            }, {
                $$strict: true,
            });
            const validateClaims = validator_1.validator.compile(claimsValidationSchema);
            return {
                activeClaimsVersions,
                claimsSchemata,
                validateClaims,
                validClaimsKeys,
                uniqueClaimsSchemata,
                validateClaimsUniqueness,
                immutableClaimsSchemata,
                validateClaimsImmutability,
            };
        }, (...args) => JSON.stringify(args));
        this.testCredentials = validator_1.validator.compile({
            password: {
                type: "string",
                min: 8,
                max: 32,
                optional: true,
            },
            password_confirmation: {
                type: "equal",
                field: "password",
                optional: true,
            },
        });
        this.logger = props.logger || console;
    }
    /* Lifecycle methods: do sort of DBMS schema migration and making connection */
    async start() {
        this.logger.info(`${kleur_1.default.blue(this.displayName)} identity provider adapter has been started`);
    }
    async stop() {
        this.logger.info(`${kleur_1.default.blue(this.displayName)} identity provider adapter has been stopped`);
    }
    async validate(args) {
        const { validateClaims, validateClaimsImmutability, validateClaimsUniqueness } = await this.getCachedActiveClaimsSchemata(args.scope);
        const mergedResult = [];
        // validate claims
        let result = validateClaims(args.claims);
        if (result !== true) {
            mergedResult.push(...result);
        }
        // validate immutable
        if (args.id) {
            result = await validateClaimsImmutability(args.id, args.claims);
            if (result !== true) {
                mergedResult.push(...result);
            }
        }
        // validate uniqueness
        result = await validateClaimsUniqueness(args.id, args.claims);
        if (result !== true) {
            mergedResult.push(...result);
        }
        // validate credentials
        if (args.credentials && Object.keys(args.credentials).length > 0) {
            result = this.testCredentials(args.credentials);
            if (result !== true) {
                mergedResult.push(...result);
            }
        }
        if (mergedResult.length > 0) {
            throw new error_1.Errors.ValidationError(mergedResult);
        }
    }
    async create(args, transaction, ignoreUndefinedClaims) {
        const { metadata = {}, claims = {}, credentials = {}, scope = [] } = args || {};
        if (claims && !claims.sub) {
            claims.sub = uuid_1.default.v4();
        }
        if (scope && scope.length !== 0 && !scope.includes("openid")) {
            scope.push("openid");
        }
        // save metadata, claims, credentials
        let isolated = false;
        if (!transaction) {
            transaction = transaction = await this.transaction();
            isolated = true;
        }
        const id = claims.sub;
        try {
            await this.createOrUpdateMetadata(id, _.defaultsDeep(metadata, metadata_1.defaultIdentityMetadata), transaction);
            await this.createOrUpdateClaimsWithValidation(id, claims, scope, true, transaction, ignoreUndefinedClaims);
            await this.createOrUpdateCredentialsWithValidation(id, credentials, transaction);
            if (isolated) {
                await transaction.commit();
            }
        }
        catch (err) {
            if (isolated) {
                await transaction.rollback();
            }
            throw err;
        }
        return id;
    }
    /* fetch and create claims entities (versioned) */
    async getClaims(id, scope) {
        // get active claims
        const { claimsSchemata } = await this.getCachedActiveClaimsSchemata(scope);
        const claims = await this.getVersionedClaims(id, claimsSchemata.map(schema => ({
            key: schema.key,
            schemaVersion: schema.version,
        })));
        for (const schema of claimsSchemata) {
            if (typeof claims[schema.key] === "undefined") {
                claims[schema.key] = null;
            }
        }
        return claims;
    }
    async createOrUpdateClaimsWithValidation(id, claims, scope, creating, transaction, ignoreUndefinedClaims) {
        const { activeClaimsVersions, claimsSchemata, validClaimsKeys } = await this.getCachedActiveClaimsSchemata(scope);
        // merge old claims and validate merged one
        const oldClaims = await this.getClaims(id, scope);
        const mergedClaims = _.defaultsDeep(claims, oldClaims);
        if (ignoreUndefinedClaims === true) {
            const ignoredClaims = {};
            for (const key of Object.keys(mergedClaims)) {
                if (!validClaimsKeys.includes(key)) {
                    ignoredClaims[key] = mergedClaims[key];
                    delete mergedClaims[key];
                }
            }
            this.logger.debug("IDP ignored undefined claims (ignoreUndefinedClaims flag enabled)", {
                claims: mergedClaims,
                ignoredClaims,
            });
        }
        try {
            await this.validate({ id: creating ? undefined : id, scope, claims: mergedClaims });
        }
        catch (err) {
            err.error_detail = { claims, mergedClaims, scope };
            throw err;
        }
        let isolated = false;
        if (!transaction) {
            isolated = true;
            transaction = await this.transaction();
        }
        try {
            const validClaimEntries = Array.from(Object.entries(mergedClaims))
                .filter(([key]) => activeClaimsVersions[key]);
            // update claims
            await this.createOrUpdateVersionedClaims(id, validClaimEntries
                .map(([key, value]) => ({
                key,
                value,
                schemaVersion: activeClaimsVersions[key],
            })), transaction);
            // set metadata scope
            await this.createOrUpdateMetadata(id, {
                scope: claimsSchemata.reduce((obj, s) => {
                    obj[s.scope] = true;
                    return obj;
                }, {}),
            }, transaction);
            // notify update for cache
            await this.onClaimsUpdated(id, validClaimEntries.reduce((obj, [key, claim]) => {
                obj[key] = claim;
                return obj;
            }, {}), transaction);
            if (isolated) {
                await transaction.commit();
            }
        }
        catch (error) {
            if (isolated) {
                await transaction.rollback();
            }
            throw error;
        }
    }
    async deleteClaims(id, scope, transaction) {
        const { claimsSchemata } = await this.getCachedActiveClaimsSchemata(scope);
        let isolated = false;
        if (!transaction) {
            isolated = true;
            transaction = await this.transaction();
        }
        try {
            // update claims as null
            await this.createOrUpdateVersionedClaims(id, claimsSchemata
                .map(schema => ({
                key: schema.key,
                value: null,
                schemaVersion: schema.version,
            })), transaction);
            // set metadata scope as false
            await this.createOrUpdateMetadata(id, {
                scope: scope.reduce((obj, s) => {
                    obj[s] = false;
                    return obj;
                }, {}),
            }, transaction);
            // notify update for cache
            await this.onClaimsUpdated(id, claimsSchemata.reduce((obj, schema) => {
                obj[schema.key] = null;
                return obj;
            }, {}), transaction);
            if (isolated) {
                await transaction.commit();
            }
        }
        catch (error) {
            if (isolated) {
                await transaction.rollback();
            }
            throw error;
        }
    }
    async onClaimsSchemaUpdated() {
        this.getCachedActiveClaimsSchemata.cache.clear();
    }
    async createOrUpdateCredentialsWithValidation(id, credentials, transaction) {
        let isolated = false;
        if (!transaction) {
            transaction = transaction = await this.transaction();
            isolated = true;
        }
        try {
            await this.validateCredentials(credentials);
            const updated = await this.createOrUpdateCredentials(id, credentials, transaction);
            await this.createOrUpdateMetadata(id, {
                credentials: Object.keys(credentials).reduce((obj, credType) => {
                    obj[credType] = true;
                    return obj;
                }, {}),
            }, transaction);
            if (isolated) {
                await transaction.commit();
            }
            return updated;
        }
        catch (err) {
            if (isolated) {
                await transaction.rollback();
            }
            throw err;
        }
    }
    async validateCredentials(credentials) {
        const result = this.testCredentials(credentials);
        if (result !== true) {
            throw new error_1.Errors.ValidationError(result);
        }
    }
}
exports.IDPAdapter = IDPAdapter;
//# sourceMappingURL=adapter.js.map
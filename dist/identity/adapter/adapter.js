"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const _ = tslib_1.__importStar(require("lodash"));
const kleur_1 = tslib_1.__importDefault(require("kleur"));
const metadata_1 = require("../metadata");
const validator_1 = require("../../validator");
const error_1 = require("../error");
const uuid_1 = tslib_1.__importDefault(require("uuid"));
class IDPAdapter {
    constructor(props, options) {
        this.props = props;
        this.getCachedActiveClaimsSchemata = _.memoize((scope) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            // get schemata
            const claimsSchemata = yield this.getClaimsSchemata({ scope, active: true });
            const activeClaimsVersions = claimsSchemata.reduce((obj, schema) => {
                obj[schema.key] = schema.version;
                return obj;
            }, {});
            // get unique claims schemata
            const uniqueClaimsSchemata = claimsSchemata.filter(s => s.unique);
            const uniqueClaimsSchemataKeys = uniqueClaimsSchemata.map(s => s.key);
            const validateClaimsUniqueness = (id, object) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                if (uniqueClaimsSchemata.length === 0)
                    return true;
                const errors = [];
                for (const key of uniqueClaimsSchemataKeys) {
                    const value = object[key];
                    const holderId = yield this.find({ claims: { [key]: value } });
                    if (holderId && id !== holderId) {
                        errors.push({
                            type: "duplicate",
                            field: key,
                            message: `The '${key}' field value is already used by other account.`,
                            actual: value,
                        });
                    }
                }
                return errors.length > 0 ? errors : true;
            });
            // get immutable claims schemata
            const immutableClaimsSchemata = claimsSchemata.filter(s => s.immutable);
            const immutableClaimsSchemataScope = immutableClaimsSchemata.map(s => s.scope);
            const immutableClaimsSchemataKeys = immutableClaimsSchemata.map(s => s.key);
            const validateClaimsImmutability = (id, object) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                if (immutableClaimsSchemata.length === 0)
                    return true;
                const errors = [];
                const oldClaims = yield this.getClaims(id, immutableClaimsSchemataScope);
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
            });
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
                uniqueClaimsSchemata,
                validateClaimsUniqueness,
                immutableClaimsSchemata,
                validateClaimsImmutability,
            };
        }), (...args) => JSON.stringify(args));
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
    start() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.logger.info(`${kleur_1.default.blue(this.displayName)} identity provider adapter has been started`);
        });
    }
    stop() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.logger.info(`${kleur_1.default.blue(this.displayName)} identity provider adapter has been stopped`);
        });
    }
    validate(args) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { validateClaims, validateClaimsImmutability, validateClaimsUniqueness } = yield this.getCachedActiveClaimsSchemata(args.scope);
            const mergedResult = [];
            // validate claims
            let result = validateClaims(args.claims);
            if (result !== true) {
                mergedResult.push(...result);
            }
            // validate immutable
            if (args.id) {
                result = yield validateClaimsImmutability(args.id, args.claims);
                if (result !== true) {
                    mergedResult.push(...result);
                }
            }
            // validate uniqueness
            result = yield validateClaimsUniqueness(args.id, args.claims);
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
        });
    }
    create(args, transaction) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { metadata, claims, credentials, scope = [] } = args || {};
            if (claims && !claims.sub) {
                claims.sub = uuid_1.default.v4();
            }
            if (scope && scope.length !== 0 && !scope.includes("openid")) {
                scope.push("openid");
            }
            // save metadata, claims, credentials
            let isolated = false;
            if (!transaction) {
                transaction = transaction = yield this.transaction();
                isolated = true;
            }
            const id = claims.sub;
            try {
                yield this.createOrUpdateMetadata(id, _.defaultsDeep(metadata, metadata_1.defaultIdentityMetadata), transaction);
                yield this.createOrUpdateClaimsWithValidation(id, claims, scope, true, transaction);
                yield this.createOrUpdateCredentialsWithValidation(id, credentials, transaction);
                if (isolated) {
                    yield transaction.commit();
                }
            }
            catch (err) {
                if (isolated) {
                    yield transaction.rollback();
                }
                throw err;
            }
            return id;
        });
    }
    /* fetch and create claims entities (versioned) */
    getClaims(id, scope) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            // get active claims
            const { claimsSchemata } = yield this.getCachedActiveClaimsSchemata(scope);
            const claims = yield this.getVersionedClaims(id, claimsSchemata.map(schema => ({
                key: schema.key,
                schemaVersion: schema.version,
            })));
            for (const schema of claimsSchemata) {
                if (typeof claims[schema.key] === "undefined") {
                    claims[schema.key] = null;
                }
            }
            return claims;
        });
    }
    createOrUpdateClaimsWithValidation(id, claims, scope, creating, transaction) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { activeClaimsVersions, claimsSchemata } = yield this.getCachedActiveClaimsSchemata(scope);
            // merge old claims and validate merged one
            const oldClaims = yield this.getClaims(id, scope);
            const mergedClaims = _.defaultsDeep(claims, oldClaims);
            try {
                yield this.validate({ id: creating ? undefined : id, scope, claims: mergedClaims });
            }
            catch (err) {
                err.error_detail = { claims, mergedClaims, scope };
                throw err;
            }
            let isolated = false;
            if (!transaction) {
                isolated = true;
                transaction = yield this.transaction();
            }
            try {
                const validClaimEntries = Array.from(Object.entries(mergedClaims))
                    .filter(([key]) => activeClaimsVersions[key]);
                // update claims
                yield this.createOrUpdateVersionedClaims(id, validClaimEntries
                    .map(([key, value]) => ({
                    key,
                    value,
                    schemaVersion: activeClaimsVersions[key],
                })), transaction);
                // set metadata scope
                yield this.createOrUpdateMetadata(id, {
                    scope: claimsSchemata.reduce((obj, s) => {
                        obj[s.scope] = true;
                        return obj;
                    }, {}),
                }, transaction);
                // notify update for cache
                yield this.onClaimsUpdated(id, validClaimEntries.reduce((obj, [key, claim]) => {
                    obj[key] = claim;
                    return obj;
                }, {}), transaction);
                if (isolated) {
                    yield transaction.commit();
                }
            }
            catch (error) {
                if (isolated) {
                    yield transaction.rollback();
                }
                throw error;
            }
        });
    }
    deleteClaims(id, scope, transaction) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { claimsSchemata } = yield this.getCachedActiveClaimsSchemata(scope);
            let isolated = false;
            if (!transaction) {
                isolated = true;
                transaction = yield this.transaction();
            }
            try {
                // update claims as null
                yield this.createOrUpdateVersionedClaims(id, claimsSchemata
                    .map(schema => ({
                    key: schema.key,
                    value: null,
                    schemaVersion: schema.version,
                })), transaction);
                // set metadata scope as false
                yield this.createOrUpdateMetadata(id, {
                    scope: scope.reduce((obj, s) => {
                        obj[s] = false;
                        return obj;
                    }, {}),
                }, transaction);
                // notify update for cache
                yield this.onClaimsUpdated(id, claimsSchemata.reduce((obj, schema) => {
                    obj[schema.key] = null;
                    return obj;
                }, {}), transaction);
                if (isolated) {
                    yield transaction.commit();
                }
            }
            catch (error) {
                if (isolated) {
                    yield transaction.rollback();
                }
                throw error;
            }
        });
    }
    onClaimsSchemaUpdated() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.getCachedActiveClaimsSchemata.cache.clear();
        });
    }
    createOrUpdateCredentialsWithValidation(id, credentials, transaction) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let isolated = false;
            if (!transaction) {
                transaction = transaction = yield this.transaction();
                isolated = true;
            }
            try {
                yield this.validateCredentials(credentials);
                const updated = yield this.createOrUpdateCredentials(id, credentials, transaction);
                yield this.createOrUpdateMetadata(id, {
                    credentials: Object.keys(credentials).reduce((obj, credType) => {
                        obj[credType] = true;
                        return obj;
                    }, {}),
                }, transaction);
                if (isolated) {
                    yield transaction.commit();
                }
                return updated;
            }
            catch (err) {
                if (isolated) {
                    yield transaction.rollback();
                }
                throw err;
            }
        });
    }
    validateCredentials(credentials) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const result = this.testCredentials(credentials);
            if (result !== true) {
                throw new error_1.Errors.ValidationError(result);
            }
        });
    }
}
exports.IDPAdapter = IDPAdapter;
//# sourceMappingURL=adapter.js.map
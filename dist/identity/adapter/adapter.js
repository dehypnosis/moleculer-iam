"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const _ = tslib_1.__importStar(require("lodash"));
const kleur_1 = tslib_1.__importDefault(require("kleur"));
const identity_1 = require("../identity");
const metadata_1 = require("../metadata");
const validator_1 = require("../../validator");
const error_1 = require("../error");
class IDPAdapter {
    constructor(props, options) {
        this.props = props;
        this.getCachedActiveClaimsSchemata = _.memoize((scope, isUpdate = true) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const claimsSchemata = yield this.getClaimsSchemata({ scope, active: true });
            const activeClaimsVersions = claimsSchemata.reduce((obj, schema) => {
                obj[schema.key] = schema.version;
                return obj;
            }, {});
            // prepare to validate and merge old claims
            const claimsValidationSchema = claimsSchemata.reduce((obj, claimsSchema) => {
                obj[claimsSchema.key] = claimsSchema.validation;
                return obj;
            }, {
                $$strict: true,
            });
            // prevent sub claim from being updated
            if (isUpdate) {
                delete claimsValidationSchema.sub;
            }
            return {
                claimsSchemata,
                activeClaimsVersions,
                validateClaims: validator_1.validator.compile(claimsValidationSchema),
            };
        }), (...args) => JSON.stringify(args));
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
    create(args) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { metadata, claims, credentials } = args;
            if (yield this.find({ id: claims.sub })) {
                throw new error_1.Errors.IdentityAlreadyExistsError();
            }
            // check openid scope sub field is defined
            if (!claims.sub) {
                throw new error_1.Errors.ValidationError([{
                        type: "required",
                        field: "sub",
                        message: "The 'sub' field is required.",
                        actual: claims.sub,
                    }]);
            }
            // create empty identity
            const identity = new identity_1.Identity({
                id: claims.sub,
                adapter: this,
            });
            // save metadata, claims, credentials
            let transaction;
            try {
                transaction = yield this.transaction();
                yield this.createOrUpdateMetadata(identity, _.defaultsDeep(metadata, metadata_1.defaultIdentityMetadata));
                yield this.createOrUpdateClaims(identity, claims, { scope: args.scope }, false);
                yield this.createOrUpdateCredentials(identity, credentials);
                yield this.onClaimsUpdated(identity);
                yield transaction.commit();
            }
            catch (err) {
                if (transaction) {
                    yield transaction.rollback();
                }
                yield this.delete(identity);
                throw err;
            }
            return identity;
        });
    }
    /* fetch and create claims entities (versioned, immutable) */
    getClaims(identity, filter) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            // get active claims
            const { claimsSchemata } = yield this.getCachedActiveClaimsSchemata(filter.scope);
            const claims = yield this.getVersionedClaims(identity, claimsSchemata.map(schema => ({
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
    createOrUpdateClaims(identity, claims, filter, isUpdate = true) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            // load old claims and active claims schemata
            const oldClaims = yield this.getClaims(identity, Object.assign(Object.assign({}, filter), { use: "userinfo" }));
            const { activeClaimsVersions, validateClaims } = yield this.getCachedActiveClaimsSchemata(filter.scope, isUpdate);
            if (isUpdate) {
                delete oldClaims.sub;
            }
            // merge old claims and validate merged one
            const mergedClaims = _.defaultsDeep(claims, oldClaims);
            const result = validateClaims(mergedClaims);
            if (result !== true) {
                throw new error_1.Errors.ValidationError(result, { claims, mergedClaims });
            }
            yield this.createOrUpdateVersionedClaims(identity, Array.from(Object.entries(mergedClaims))
                .map(([key, value]) => ({
                key,
                value,
                schemaVersion: activeClaimsVersions[key],
            })));
        });
    }
    onClaimsSchemaUpdated() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.getCachedActiveClaimsSchemata.cache.clear();
        });
    }
}
exports.IDPAdapter = IDPAdapter;
//# sourceMappingURL=adapter.js.map
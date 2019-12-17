"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const _ = tslib_1.__importStar(require("lodash"));
const kleur_1 = tslib_1.__importDefault(require("kleur"));
const object_hash_1 = tslib_1.__importDefault(require("object-hash"));
const identity_1 = require("../identity");
const validator_1 = require("../../validator");
const error_1 = require("../error");
class IDPAdapter {
    constructor(props, options) {
        this.props = props;
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
            if (yield this.find({ id: claims.sub }, { softDeleted: undefined })) {
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
            try {
                yield this.prepareToCreate(identity);
                yield this.updateMetadata(identity, metadata);
                yield this.updateClaims(identity, claims, { scope: args.scope });
                yield this.updateCredentials(identity, credentials);
            }
            catch (err) {
                yield identity.delete(false);
                throw err;
            }
            return identity;
        });
    }
    /* fetch claims cache and create claims entities (versioned, immutable) */
    getClaimsCacheFilterKey(filter) {
        return object_hash_1.default(filter, {
            algorithm: "md5",
            unorderedArrays: true,
            unorderedObjects: true,
            unorderedSets: true,
        });
    }
    claims(identity, filter) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            // check cache
            const cacheFilterKey = this.getClaimsCacheFilterKey(filter);
            if (this.getClaimsCache) {
                const cachedClaims = yield this.getClaimsCache(identity, cacheFilterKey);
                if (cachedClaims) {
                    return cachedClaims;
                }
            }
            // get active claims
            const claimsSchemata = yield this.getClaimsSchemata({ scope: filter.scope, active: true });
            const claims = yield this.getClaimsVersion(identity, claimsSchemata.map(schema => ({
                key: schema.key,
                schemaVersion: schema.version,
            })));
            for (const schema of claimsSchemata) {
                if (typeof claims[schema.key] === "undefined") {
                    claims[schema.key] = null;
                }
            }
            // save cache
            if (this.setClaimsCache) {
                yield this.setClaimsCache(identity, cacheFilterKey, claims);
            }
            return claims;
        });
    }
    updateClaims(identity, claims, filter) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            // load active claims schemata
            const claimsSchemata = yield this.getClaimsSchemata({ scope: filter.scope, active: true });
            const claimsSchemataObject = claimsSchemata.reduce((obj, schema) => {
                obj[schema.key] = schema;
                return obj;
            }, {});
            // prepare to validate and merge old claims
            const claimsValidationSchema = claimsSchemata.reduce((obj, claimsSchema) => {
                obj[claimsSchema.key] = claimsSchema.validation;
                return obj;
            }, {
                $$strict: true,
            });
            const oldClaims = yield this.claims(identity, Object.assign(Object.assign({}, filter), { use: "userinfo" }));
            // prevent sub claim from being updated
            if (oldClaims.sub) {
                delete claimsValidationSchema.sub;
                delete oldClaims.sub;
            }
            const validate = validator_1.validator.compile(claimsValidationSchema);
            // merge old claims
            const mergedClaims = _.defaultsDeep(claims, oldClaims);
            const result = validate(mergedClaims);
            if (result !== true) {
                throw new error_1.Errors.ValidationError(result, { claims, mergedClaims });
            }
            yield this.putClaimsVersion(identity, Array.from(Object.entries(mergedClaims))
                .map(([key, value]) => ({
                key,
                value,
                schemaVersion: claimsSchemataObject[key].version,
            })));
            // clear cache
            if (this.clearClaimsCache) {
                yield this.clearClaimsCache(identity);
            }
        });
    }
}
exports.IDPAdapter = IDPAdapter;
//# sourceMappingURL=adapter.js.map
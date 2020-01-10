"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const request_promise_native_1 = tslib_1.__importDefault(require("request-promise-native"));
const error_1 = require("../../identity/error");
const passport_google_oauth_1 = require("passport-google-oauth");
const passport_kakao_1 = require("passport-kakao");
const passport_facebook_1 = require("passport-facebook");
exports.Strategies = {
    kakao: passport_kakao_1.Strategy,
    google: passport_google_oauth_1.OAuth2Strategy,
    facebook: passport_facebook_1.Strategy,
};
exports.defaultIdentityFederationManagerOptions = {
    kakao: {
        clientID: "",
        clientSecret: "",
        scope: "profile account_email",
        callback: (args) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const { accessToken, idp, profile } = args;
            const upsertScopes = [...idp.claims.mandatoryScopes];
            const kakao = { id: profile.id };
            const claims = {
                name: profile._json.kakao_account.profile.nickname,
                picture: profile._json.kakao_account.profile.profile_image_url,
                email: profile._json.kakao_account.email,
                email_verified: profile._json.kakao_account.is_email_verified,
            };
            if (!claims.email) {
                throw new error_1.Errors.UnexpectedError("cannot federate without an email address");
            }
            if (!claims.email_verified) {
                delete claims.email_verified;
            }
            if (!claims.picture) {
                delete claims.picture;
            }
            // 1. find existing account
            let identity = yield idp.find({ metadata: { federation: { kakao } } });
            // 2. connect the identity which has same email address
            if (!identity && claims.email) {
                identity = yield idp.find({ claims: { email: claims.email } });
                if (identity) {
                    const oldClaims = yield identity.claims("userinfo", "email");
                    if (!oldClaims.email_verified) {
                        throw new error_1.Errors.UnexpectedError("cannot federate an existing account with non-verified email address");
                    }
                }
            }
            // 4. update or create
            if (identity) {
                if (yield identity.isSoftDeleted()) {
                    throw new error_1.Errors.UnexpectedError("cannot federate a deleted account");
                }
                yield identity.updateMetadata({ federation: { kakao } });
                yield identity.updateClaims(claims, upsertScopes);
                return identity;
            }
            else {
                return idp.create({
                    metadata: { federation: { kakao } },
                    claims,
                    credentials: {},
                    scope: upsertScopes,
                });
            }
        }),
    },
    facebook: {
        clientID: "",
        clientSecret: "",
        scope: "public_profile email",
        profileFields: ["id", "name", "displayName", "photos", "email"],
        enableProof: true,
        callback: (args) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const { accessToken, idp, profile } = args;
            const upsertScopes = [...idp.claims.mandatoryScopes];
            const facebook = { id: profile.id };
            const claims = {
                name: profile.displayName,
                picture: profile.photos[0] && profile.photos[0].value || null,
                email: profile.emails[0] && profile.emails[0].value || null,
                email_verified: true,
            };
            if (!claims.email) {
                throw new error_1.Errors.UnexpectedError("cannot federate without an email address");
            }
            if (!claims.picture) {
                delete claims.picture;
            }
            // 1. find existing account
            let identity = yield idp.find({ metadata: { federation: { facebook } } });
            // 2. connect the identity which has same email address
            if (!identity && claims.email) {
                identity = yield idp.find({ claims: { email: claims.email } });
                if (identity) {
                    const oldClaims = yield identity.claims("userinfo", "email");
                    if (!oldClaims.email_verified) {
                        throw new error_1.Errors.UnexpectedError("cannot federate an existing account with non-verified email address");
                    }
                }
            }
            // 4. update or create
            if (identity) {
                if (yield identity.isSoftDeleted()) {
                    throw new error_1.Errors.UnexpectedError("cannot federate a deleted account");
                }
                yield identity.updateMetadata({ federation: { facebook } });
                yield identity.updateClaims(claims, upsertScopes);
                return identity;
            }
            else {
                return idp.create({
                    metadata: { federation: { facebook } },
                    claims,
                    credentials: {},
                    scope: upsertScopes,
                });
            }
        }),
    },
    google: {
        clientID: "",
        clientSecret: "",
        // approval_prompt: "auto",
        prompt: "select_account",
        scope: "openid profile email",
        callback: (args) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const { accessToken, idp, profile } = args;
            const upsertScopes = [...idp.claims.mandatoryScopes];
            const claims = profile._json;
            const google = { id: claims.sub, hd: claims.hd || null };
            delete claims.sub;
            delete claims.hd;
            if (!claims.email) {
                throw new error_1.Errors.UnexpectedError("cannot federate without an email address");
            }
            if (!claims.email_verified) {
                delete claims.email_verified;
            }
            if (!claims.picture) {
                delete claims.picture;
            }
            // 1. find existing account
            let identity = yield idp.find({ metadata: { federation: { google: { id: google.id } } } });
            // 2. connect the identity which has same email address
            if (!identity && claims.email) {
                identity = yield idp.find({ claims: { email: claims.email } });
                if (identity) {
                    const oldClaims = yield identity.claims("userinfo", "email");
                    if (!oldClaims.email_verified) {
                        throw new error_1.Errors.UnexpectedError("cannot federate an existing account with non-verified email address");
                    }
                }
            }
            // 3. if has complete identity
            if (identity) {
                if (yield identity.isSoftDeleted()) {
                    throw new error_1.Errors.UnexpectedError("cannot federate a deleted account");
                }
                // if phone scope is requested
                if (args.scope.some(s => s.includes("phone"))) {
                    const oldClaims = yield identity.claims("userinfo", "phone");
                    if (oldClaims.phone_number) {
                        // already have phone claims
                        return identity;
                    }
                }
            }
            // 4. get phone number if existing claim is empty but having phone scope
            try {
                const response = yield request_promise_native_1.default.get("https://people.googleapis.com/v1/people/me?personFields=phoneNumbers", {
                    json: true,
                    auth: {
                        bearer: accessToken,
                    },
                });
                if (response.phoneNumbers && response.phoneNumbers[0] && response.phoneNumbers[0].value) {
                    // tslint:disable-next-line:variable-name
                    const phone_number = response.phoneNumbers[0].value;
                    const result = idp.validateEmailOrPhoneNumber({ phone_number });
                    if (result === true) {
                        upsertScopes.push("phone");
                        claims.phone_number = phone_number;
                        claims.phone_number_verified = true;
                    }
                    else {
                        args.logger.error("failed to validate phone_number from google", result);
                    }
                }
            }
            catch (response) {
                if (response.error && response.error.error) {
                    args.logger.error("failed to fetch phone_number from google", response.error.error);
                }
                else {
                    args.logger.error("failed to fetch phone_number from google", response);
                }
            }
            // 5. update or create
            if (identity) {
                yield identity.updateMetadata({ federation: { google } });
                yield identity.updateClaims(claims, upsertScopes);
                return identity;
            }
            else {
                return idp.create({
                    metadata: { federation: { google } },
                    claims,
                    credentials: {},
                    scope: upsertScopes,
                });
            }
        }),
    },
};
//# sourceMappingURL=federation.presets.js.map
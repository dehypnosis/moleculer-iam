"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const request_promise_native_1 = tslib_1.__importDefault(require("request-promise-native"));
const passport_google_oauth_1 = require("passport-google-oauth");
const idp_1 = require("../../idp");
// add https://www.googleapis.com/auth/user.phonenumbers.read
// to get phone number with user confirmation
exports.googleProviderConfiguration = {
    clientID: "",
    clientSecret: "",
    // approval_prompt: "auto",
    prompt: "select_account",
    scope: "openid profile email",
    strategy: (options, verify) => {
        return new passport_google_oauth_1.OAuth2Strategy(options, verify);
    },
    callback: async (props) => {
        const { accessToken, refreshToken, scope, logger, idp, profile } = props;
        // gather federation metadata
        const claims = profile._json;
        const metadata = { federation: { google: { id: claims.sub, hd: claims.hd || null } } };
        delete claims.sub;
        delete claims.hd;
        if (!claims.email) {
            throw new idp_1.Errors.UnexpectedError("cannot federate without an email address");
        }
        if (!claims.email_verified) {
            delete claims.email_verified;
        }
        if (!claims.picture) {
            delete claims.picture;
        }
        // find existing account
        let identity = await idp.find({ metadata });
        // 2. connect the identity which has same email address
        if (!identity && claims.email) {
            identity = await idp.find({ claims: { email: claims.email } });
            // if (identity) {
            //   const oldClaims = await identity.claims("userinfo", "email");
            //   if (!oldClaims.email_verified) {
            //     throw new Errors.UnexpectedError("cannot federate an existing account with non-verified email address");
            //   }
            // }
        }
        // if has existing identity
        if (identity) {
            if (await identity.isSoftDeleted()) {
                throw new idp_1.Errors.UnexpectedError("cannot federate a deleted account");
            }
            // if phone scope is requested
            if (props.scope.some(s => s.includes("phone"))) {
                const oldClaims = await identity.claims("userinfo", "phone");
                if (oldClaims.phone_number) {
                    // already have phone claims
                    return identity;
                }
            }
        }
        // get phone number if existing claim is empty but having phone scope
        const upsertScopes = [...idp.claims.mandatoryScopes];
        try {
            const response = await request_promise_native_1.default.get("https://people.googleapis.com/v1/people/me?personFields=phoneNumbers", {
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
                    props.logger.error("failed to validate phone_number from google", result);
                }
            }
        }
        catch (response) {
            if (response.error && response.error.error) {
                props.logger.error("failed to fetch phone_number from google", response.error.error);
            }
            else {
                props.logger.error("failed to fetch phone_number from google", response);
            }
        }
        // update or create
        if (identity) {
            await identity.updateMetadata(metadata);
            await identity.updateClaims(claims, upsertScopes, undefined, true);
            return identity;
        }
        else {
            return idp.create({
                metadata,
                claims,
                credentials: {},
                scope: upsertScopes,
            }, undefined, true);
        }
    },
};
//# sourceMappingURL=google.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const passport_facebook_1 = require("passport-facebook");
const idp_1 = require("../../../idp");
// facebook is not a OIDC provider; openid scope not supported
// phone scope is not supported (seems only for the whatsapp platform apps)
exports.facebookProviderConfiguration = {
    clientID: "",
    clientSecret: "",
    scope: "public_profile email",
    profileFields: ["id", "name", "displayName", "photos", "email"],
    enableProof: true,
    strategy: (options, verify) => {
        return new passport_facebook_1.Strategy(options, verify);
    },
    callback: async (args) => {
        const { accessToken, refreshToken, profile, scope, idp, logger } = args;
        // gather federation metadata
        const metadata = { federation: { facebook: { id: profile.id } } };
        // gather claims
        const claims = {
            name: profile.displayName,
            picture: profile.photos[0] && profile.photos[0].value || null,
            email: profile.emails[0] && profile.emails[0].value || null,
            email_verified: true,
        };
        if (!claims.email) {
            throw new idp_1.Errors.UnexpectedError("cannot federate without an email address");
        }
        if (!claims.picture) {
            delete claims.picture;
        }
        // find existing account
        let identity = await idp.find({ metadata });
        // connect the identity which has same email address
        if (!identity && claims.email) {
            identity = await idp.find({ claims: { email: claims.email } });
            // if (identity) {
            //   const oldClaims = await identity.claims("userinfo", "email");
            //   if (!oldClaims.email_verified) {
            //     throw new Errors.UnexpectedError("cannot federate an existing account with non-verified email address");
            //   }
            // }
        }
        // update or create
        const upsertScopes = idp.claims.mandatoryScopes;
        if (identity) {
            if (await identity.isSoftDeleted()) {
                throw new idp_1.Errors.UnexpectedError("cannot federate a deleted account");
            }
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
//# sourceMappingURL=facebook.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
import { IOAuth2StrategyOption as GoogleFederationOptions, OAuth2Strategy as GoogleStrategy } from "passport-google-oauth";

import { StrategyOption as FacebookFederationOptions, Strategy as FacebookStrategy } from "passport-facebook";

export interface GoogleProviderConfiguration extends IdentityFederationPresetProviderConfiguration, GoogleFederationOptions {
}

export interface FacebookProviderConfiguration extends IdentityFederationPresetProviderConfiguration, FacebookFederationOptions {
}

export type IdentityFederationPresetProviderConfigurationMap = IdentityFederationProviderConfigurationMap & {
  kakao: KakaoProviderConfiguration;
  google: GoogleProviderConfiguration;
  facebook: FacebookProviderConfiguration;
};

export const identityFederationPresetProviderConfigurationMap: IdentityFederationPresetProviderConfigurationMap = {
  google: GoogleStrategy,
  facebook: FacebookStrategy,
};

export const defaultIdentityFederationProviderOptions: IdentityFederationProviderOptions = {
  kakao: {

  },
  facebook: {
    clientID: "",
    clientSecret: "",
    scope: "public_profile email", // not a oidc provider, phone is not supported (seems only for the whatsapp platform apps)
    profileFields: ["id", "name", "displayName", "photos", "email"],
    enableProof: true,
    callback: async (props) => {
      const {accessToken, idp, profile} = props;
      const upsertScopes = [...idp.claims.mandatoryScopes];
      const facebook = {id: profile.id};
      const claims: Partial<OIDCAccountClaims> = {
        name: (profile as any).displayName,
        picture: (profile as any).photos[0] && (profile as any).photos[0].value || null,
        email: (profile as any).emails[0] && (profile as any).emails[0].value || null,
        email_verified: true,
      };
      if (!claims.email) {
        throw new Errors.UnexpectedError("cannot federate without an email address");
      }
      if (!claims.picture) {
        delete claims.picture;
      }

      // 1. find existing account
      let identity = await idp.find({metadata: {federation: {facebook}}});

      // 2. connect the identity which has same email address
      if (!identity && claims.email) {
        identity = await idp.find({claims: {email: claims.email}});
        // if (identity) {
        //   const oldClaims = await identity.claims("userinfo", "email");
        //   if (!oldClaims.email_verified) {
        //     throw new Errors.UnexpectedError("cannot federate an existing account with non-verified email address");
        //   }
        // }
      }

      // 3. update or create
      if (identity) {
        if (await identity.isSoftDeleted()) {
          throw new Errors.UnexpectedError("cannot federate a deleted account");
        }

        await identity.updateMetadata({federation: {facebook}});
        await identity.updateClaims(claims, upsertScopes, undefined, true);
        return identity;
      } else {
        return idp.create({
          metadata: {federation: {facebook}},
          claims,
          credentials: {},
          scope: upsertScopes,
        }, undefined, true);
      }
    },
  },
  google: {
    clientID: "",
    clientSecret: "",
    // approval_prompt: "auto",
    prompt: "select_account",
    scope: "openid profile email", // add https://www.googleapis.com/auth/user.phonenumbers.read to get phone number with user confirmation
    callback: async (props) => {
      const {accessToken, idp, profile} = props;
      const upsertScopes = [...idp.claims.mandatoryScopes];
      const claims: OIDCAccountClaims = (profile as any)._json;
      const google = {id: claims.sub, hd: claims.hd || null};
      delete claims.sub;
      delete claims.hd;
      if (!claims.email) {
        throw new Errors.UnexpectedError("cannot federate without an email address");
      }
      if (!claims.email_verified) {
        delete claims.email_verified;
      }
      if (!claims.picture) {
        delete claims.picture;
      }

      // 1. find existing account
      let identity = await idp.find({metadata: {federation: {google: {id: google.id}}}});

      // 2. connect the identity which has same email address
      if (!identity && claims.email) {
        identity = await idp.find({claims: {email: claims.email}});
        // if (identity) {
        //   const oldClaims = await identity.claims("userinfo", "email");
        //   if (!oldClaims.email_verified) {
        //     throw new Errors.UnexpectedError("cannot federate an existing account with non-verified email address");
        //   }
        // }
      }

      // 3. if has complete identity
      if (identity) {
        if (await identity.isSoftDeleted()) {
          throw new Errors.UnexpectedError("cannot federate a deleted account");
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

      // 4. get phone number if existing claim is empty but having phone scope
      try {
        const response = await request.get("https://people.googleapis.com/v1/people/me?personFields=phoneNumbers", {
          json: true,
          auth: {
            bearer: accessToken,
          },
        });

        if (response.phoneNumbers && response.phoneNumbers[0] && response.phoneNumbers[0].value) {
          // tslint:disable-next-line:variable-name
          const phone_number = response.phoneNumbers[0].value;
          const result = idp.validateEmailOrPhoneNumber({phone_number});
          if (result === true) {
            upsertScopes.push("phone");
            claims.phone_number = phone_number;
            claims.phone_number_verified = true;
          } else {
            props.logger.error("failed to validate phone_number from google", result);
          }
        }
      } catch (response) {
        if (response.error && response.error.error) {
          props.logger.error("failed to fetch phone_number from google", response.error.error);
        } else {
          props.logger.error("failed to fetch phone_number from google", response);
        }
      }

      // 5. update or create
      if (identity) {
        await identity.updateMetadata({federation: {google}});
        await identity.updateClaims(claims, upsertScopes, undefined, true);
        return identity;
      } else {
        return idp.create({
          metadata: {federation: {google}},
          claims,
          credentials: {},
          scope: upsertScopes,
        }, undefined, true);
      }
    },
  },
};
 */
//# sourceMappingURL=federation.index.js.map
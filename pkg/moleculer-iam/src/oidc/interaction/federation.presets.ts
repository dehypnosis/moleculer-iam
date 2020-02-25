import request from "request-promise-native";
import { Profile, Strategy } from "passport";
import { OIDCAccountClaims } from "../account";
import { Errors } from "../../identity/error";
import { Identity, IdentityProvider } from "../../identity";
import { Logger } from "../../logger";
import { IOAuth2StrategyOption as GoogleOptions, OAuth2Strategy as GoogleStrategy } from "passport-google-oauth";
import { StrategyOption as KakaoOptions, Strategy as KakaoStrategy } from "passport-kakao";
import { StrategyOption as FacebookOptions, Strategy as FacebookStrategy } from "passport-facebook";

export type FederationCallback = (args: { idp: IdentityProvider, profile: Profile, accessToken: string, scope: string[], logger: Logger }) => Promise<Identity | void>;

export type IdentityFederationManagerOptions = {
  kakao?: Partial<Omit<KakaoOptions, "callbackURL"> & { scope: string | string[], callback: FederationCallback }>,
  google?: Partial<Omit<GoogleOptions, "callbackURL"> & { scope: string | string[], callback: FederationCallback }>,
  facebook?: Partial<Omit<FacebookOptions, "callbackURL"> & { scope: string | string[], callback: FederationCallback }>,
} & {
  [key: string]: { scope: string | string[], callback: FederationCallback, [key: string]: any },
};

export const Strategies: { [provider: string]: new(opts: any, callback: any) => Strategy } = {
  kakao: KakaoStrategy,
  google: GoogleStrategy,
  facebook: FacebookStrategy,
};

export const defaultIdentityFederationManagerOptions: IdentityFederationManagerOptions = {
  kakao: {
    clientID: "",
    clientSecret: "",
    scope: "profile account_email", // not a oidc provider, phone is not supported
    callback: async (args: any) => {
      const {accessToken, idp, profile} = args;
      const upsertScopes = [...idp.claims.mandatoryScopes];
      const kakao = {id: profile.id};
      const claims: Partial<OIDCAccountClaims> = {
        name: (profile as any)._json.kakao_account.profile.nickname,
        picture: (profile as any)._json.kakao_account.profile.profile_image_url,
        email: (profile as any)._json.kakao_account.email,
        email_verified: (profile as any)._json.kakao_account.is_email_verified,
      };
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
      let identity = await idp.find({metadata: {federation: {kakao}}});

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

      // 4. update or create
      if (identity) {
        if (await identity.isSoftDeleted()) {
          throw new Errors.UnexpectedError("cannot federate a deleted account");
        }

        await identity.updateMetadata({federation: {kakao}});
        await identity.updateClaims(claims, upsertScopes);
        return identity;
      } else {
        return idp.create({
          metadata: {federation: {kakao}},
          claims,
          credentials: {},
          scope: upsertScopes,
        });
      }
    },
  },
  facebook: {
    clientID: "",
    clientSecret: "",
    scope: "public_profile email", // not a oidc provider, phone is not supported (seems only for the whatsapp platform apps)
    profileFields: ["id", "name", "displayName", "photos", "email"],
    enableProof: true,
    callback: async (args: any) => {
      const {accessToken, idp, profile} = args;
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
        await identity.updateClaims(claims, upsertScopes);
        return identity;
      } else {
        return idp.create({
          metadata: {federation: {facebook}},
          claims,
          credentials: {},
          scope: upsertScopes,
        });
      }
    },
  },
  google: {
    clientID: "",
    clientSecret: "",
    // approval_prompt: "auto",
    prompt: "select_account",
    scope: "openid profile email", // add https://www.googleapis.com/auth/user.phonenumbers.read to get phone number with user confirmation
    callback: async (args: any) => {
      const {accessToken, idp, profile} = args;
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
        if (args.scope.some((s: string[]) => s.includes("phone"))) {
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
            args.logger.error("failed to validate phone_number from google", result);
          }
        }
      } catch (response) {
        if (response.error && response.error.error) {
          args.logger.error("failed to fetch phone_number from google", response.error.error);
        } else {
          args.logger.error("failed to fetch phone_number from google", response);
        }
      }

      // 5. update or create
      if (identity) {
        await identity.updateMetadata({federation: {google}});
        await identity.updateClaims(claims, upsertScopes);
        return identity;
      } else {
        return idp.create({
          metadata: {federation: {google}},
          claims,
          credentials: {},
          scope: upsertScopes,
        });
      }
    },
  },
};

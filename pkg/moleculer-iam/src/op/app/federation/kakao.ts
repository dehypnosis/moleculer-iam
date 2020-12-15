import { StrategyOption, Strategy, Profile } from "passport-kakao";
import { IdentityFederationProviderConfiguration, OIDCAccountClaims } from "../../proxy";
import { OIDCProviderProxyErrors } from "../../proxy/error";

export type KakaoProviderConfiguration = IdentityFederationProviderConfiguration<Profile, StrategyOption>;

// Kakao is not a OIDC provider; openid scope not supported
// phone scope not supported
export const kakaoProviderConfiguration: KakaoProviderConfiguration = {
  clientID: "",
  clientSecret: "",
  scope: "profile account_email",
  strategy: (options, verify) => {
    return new Strategy(options as any, verify as any);
  },
  callback: async (args) => {
    const {accessToken, refreshToken, idp, profile, logger, scope} = args;

    // gather federation metadata
    const metadata = {federation: {kakao: {id: profile.id}}};

    // gather claims
    const claims: Partial<OIDCAccountClaims> = {
      name: profile._json.kakao_account.profile.nickname,
      picture: profile._json.kakao_account.profile.profile_image_url,
      email: profile._json.kakao_account.email,
      email_verified: profile._json.kakao_account.is_email_verified,
    };

    if (!claims.email) {
      throw new OIDCProviderProxyErrors.FederationRequestWithoutEmailPayload();
    }

    if (!claims.email_verified) {
      delete claims.email_verified;
    }

    if (!claims.picture) {
      delete claims.picture;
    }

    // find existing account
    let identity = await idp.find({metadata});

    // connect the identity which has same email address
    if (!identity && claims.email) {
      identity = await idp.find({claims: {email: claims.email}});
      // if (identity) {
      //   const oldClaims = await identity.claims("userinfo", "email");
      //   if (!oldClaims.email_verified) {
      //     throw new IAMErrors.UnexpectedError("cannot federate an existing account with non-verified email address");
      //   }
      // }
    }

    // update or create
    const upsertScopes = idp.claims.mandatoryScopes as string[];
    if (identity) {
      if (await identity.isSoftDeleted()) {
        throw new OIDCProviderProxyErrors.FederationRequestForDeletedAccount();
      }

      await identity.updateMetadata(metadata);
      await identity.updateClaims(claims, upsertScopes, undefined, true);
      return identity;
    } else {
      return idp.create({
        metadata,
        claims,
        credentials: {},
        scope: upsertScopes,
      }, undefined, true);
    }
  },
};

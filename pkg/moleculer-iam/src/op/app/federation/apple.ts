import AppleStrategy from "passport-apple";
import { IdentityFederationProviderConfiguration, OIDCAccountClaims } from "../../proxy";
import { OIDCProviderProxyErrors } from "../../proxy/error";
export type AppleProviderConfiguration = IdentityFederationProviderConfiguration<AppleStrategy.Profile, AppleStrategy.AuthenticateOptions>;


export const appleProviderConfiguration: Omit<AppleProviderConfiguration, 'clientSecret'> = {
  clientID: '',
  teamID: '',
  keyID: '',
  callbackURL: '',
  privateKeyString: '',
  scope: "openid name email profile impersonation",
  strategy: (options, verify) => {
    console.log('options:', options);
    return new AppleStrategy(options, verify as any);
  },
  callback: async (args) => {
    const {accessToken, refreshToken, profile, decodedIdToken, scope, idp, logger} = args;

    // gather federation metadata
    const userEmail = decodedIdToken && decodedIdToken.email ? decodedIdToken.email : '';
    const metadata = { federation: {apple: {id: decodedIdToken && decodedIdToken.sub || '' }}};

    // gather claims
    const claims: Partial<OIDCAccountClaims> = {
      email: userEmail || null,
      email_verified: true,
    };

    if (!userEmail) {
      // no email
      throw new OIDCProviderProxyErrors.FederationRequestWithoutEmailPayload();
    }

    // find existing account
    let identity = await idp.find({metadata});

    // connect the identity which has same email address
    if (!identity && userEmail) {
      // user email exist but no identity
      identity = await idp.find({claims: {email: userEmail}});
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

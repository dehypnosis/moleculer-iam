// @ts-ignore
import "oidc-provider";
import { AnyObject, ClaimsWithRejects, ClientAuthorizationState, InteractionResults } from "oidc-provider";
import * as jose from "jose";

export { AdapterConstructor as OIDCModelAdapterConstructor, AdapterPayload as OIDCModelPayload, Adapter as OIDCModelAdapter, errors as OIDCErrors } from "oidc-provider";

declare module "oidc-provider" {
  export type OIDCModelName = "Session" | "AccessToken" | "AuthorizationCode" | "RefreshToken" | "DeviceCode" | "ClientCredentials" | "Client" |
    "InitialAccessToken" | "RegistrationAccessToken" | "Interaction" | "ReplayDetection" | "PushedAuthorizationRequest";

  export type VolatileOIDCModelName = Exclude<OIDCModelName, "Client" | "ClientCredentials">;

  export type Interaction = {
    iat: number;
    exp: number;
    session?: {
      accountId: string;
      cookie: string;
      jti?: string;
      acr?: string;
      amr?: string[];
    };
    params: AnyObject;
    prompt: {
      name: "login" | "consent" | string;
      reasons: string[];
      details: AnyObject;
    };
    result: InteractionResults;
    returnTo: string;
    signed?: string[];
    uid: string;
    lastSubmission?: InteractionResults;

    save(ttl?: number): Promise<string>;
  };

  export type Client = {
    clientId: string;
    keystore: any;
    grantTypes?: string[];
    redirectUris?: string[];
    responseTypes?: ResponseType[];

    applicationType?: "web" | "native";
    clientIdIssuedAt?: number;
    clientName?: string;
    clientSecretExpiresAt?: number;
    clientSecret?: string;
    clientUri?: string;
    contacts?: string[];
    defaultAcrValues?: string[];
    defaultMaxAge?: number;
    idTokenSignedResponseAlg?: string;
    initiateLoginUri?: string;
    jwksUri?: string;
    jwks?: jose.JSONWebKeySet;
    logoUri?: string;
    policyUri?: string;
    postLogoutRedirectUris?: string[];
    requireAuthTime?: boolean;
    scope?: string;
    sectorIdentifierUri?: string;
    subjectType?: SubjectTypes;
    tokenEndpointAuthMethod?: string;
    tosUri?: string;

    tlsClientAuthSubjectDn?: string;
    tlsClientAuthSanDns?: string;
    tlsClientAuthSanUri?: string;
    tlsClientAuthSanIp?: string;
    tlsClientAuthSanEmail?: string;
    tokenEndpointAuthSigningAlg?: string;
    userinfoSignedResponseAlg?: string;
    introspectionEndpointAuthMethod?: string;
    introspectionEndpointAuthSigningAlg?: string;
    introspectionSignedResponseAlg?: string;
    introspectionEncryptedResponseAlg?: string;
    introspectionEncryptedResponseEnc?: string;
    revocationEndpointAuthMethod?: string;
    revocationEndpointAuthSigningAlg?: string;
    backchannelLogoutSessionRequired?: boolean;
    backchannelLogoutUri?: string;
    frontchannelLogoutSessionRequired?: boolean;
    frontchannelLogoutUri?: string;
    requestObjectSigningAlg?: string;
    requestObjectEncryptionAlg?: string;
    requestObjectEncryptionEnc?: string;
    requestUris?: string[];
    idTokenEncryptedResponseAlg?: string;
    idTokenEncryptedResponseEnc?: string;
    userinfoEncryptedResponseAlg?: string;
    userinfoEncryptedResponseEnc?: string;
    authorizationSignedResponseAlg?: string;
    authorizationEncryptedResponseAlg?: string;
    authorizationEncryptedResponseEnc?: string;
    webMessageUris?: string[];
    tlsClientCertificateBoundAccessTokens?: boolean;
    [key: string]: any;
  };

  export type Session = {
    iat: number;
    exp: number;
    uid: string;
    jti: string;

    account?: string;
    acr?: string;
    amr?: string[];
    loginTs?: number;
    transient?: boolean;
    state?: AnyObject;
    authorizations?: {
      [clientId: string]: ClientAuthorizationState;
    };
  };

  export type AuthorizationCode = {
    iat: number;
    exp: number;
    uid: string;
    jti: string;

    redirectUri?: string;
    codeChallenge?: string;
    codeChallengeMethod?: string;
    accountId?: string;
    acr?: string;
    amr?: string[];
    authTime?: number;
    claims?: ClaimsWithRejects;
    nonce?: string;
    resource?: string;
    scope?: string;
    sid?: string;
    sessionUid?: string;
    expiresWithSession?: boolean;
    "x5t#S256"?: string;
    jkt?: string;
    grantId?: string;
    gty?: string;
  };

  export type AccessToken = {
    iat: number;
    exp: number;
    uid: string;
    jti: string;

    accountId: string;
    aud?: string[];
    claims?: ClaimsWithRejects;
    extra?: AnyObject;
    grantId: string;
    scope?: string;
    gty: string;
    sid?: string;
    sessionUid?: string;
    expiresWithSession?: boolean;
    tokenType: string;
    "x5t#S256"?: string;
    jkt?: string;
  };

  export type RefreshToken = {
    iat: number;
    exp: number;
    uid: string;
    jti: string;

    rotations?: number;
    accountId: string;
    acr?: string;
    amr?: string[];
    authTime?: number;
    claims?: ClaimsWithRejects;
    nonce?: string;
    resource?: string;
    scope?: string;
    sid?: string;
    sessionUid?: string;
    expiresWithSession?: boolean;
    "x5t#S256"?: string;
    jkt?: string;
    grantId?: string;
    gty?: string;
    consumed?: any;
  };

  export type DeviceCode = {
    iat: number;
    exp: number;
    uid: string;
    jti: string;

    error?: string;
    errorDescription?: string;
    params?: AnyObject;
    userCode: string;
    inFlight?: boolean;
    deviceInfo?: AnyObject;
    codeChallenge?: string;
    codeChallengeMethod?: string;
    accountId?: string;
    acr?: string;
    amr?: string[];
    authTime?: number;
    claims?: ClaimsWithRejects;
    nonce?: string;
    resource?: string;
    scope?: string;
    sid?: string;
    sessionUid?: string;
    expiresWithSession?: boolean;
    grantId: string;
    gty: string;
    consumed?: any;
  };
}

export * from "oidc-provider";

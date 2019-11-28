import "oidc-provider";
import * as jose from "jose";
import { OIDCModelName } from "oidc-provider";
import { Logger } from "../../logger";

export { AdapterConstructor as OIDCModelAdapterConstructor, AdapterPayload as OIDCModelPayload, Adapter as OIDCModelAdapter, errors as OIDCErrors } from "oidc-provider";

declare module "oidc-provider" {
  export type OIDCModelName = "Session" | "AccessToken" | "AuthorizationCode" | "RefreshToken" | "DeviceCode" | "ClientCredentials" | "Client" |
    "InitialAccessToken" | "RegistrationAccessToken" | "Interaction" | "ReplayDetection" | "PushedAuthorizationRequest";

  export type Client = {
    responseTypeAllowed(type: ResponseType): boolean;
    grantTypeAllowed(type: string): boolean;
    redirectUriAllowed(redirectUri: string): boolean;
    checkSessionOriginAllowed(origin: string): boolean;
    webMessageUriAllowed(webMessageUri: string): boolean;
    requestUriAllowed(requestUri: string): boolean;
    postLogoutRedirectUriAllowed(postLogoutRedirectUri: string): boolean;
    backchannelLogout(sub: string, sid: string): Promise<void>;
    includeSid(): boolean;
    metadata(): ClientMetadata;
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

  // extend models adapter
  interface Adapter {
    get(...args: any[]): Promise<AdapterPayload[]>;
  }
}

export * from "oidc-provider";

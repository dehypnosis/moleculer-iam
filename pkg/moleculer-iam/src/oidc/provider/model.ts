import { OIDCModelName } from "./types";

export const OIDCModelNames: ReadonlyArray<OIDCModelName> = [
  "Session",
  "AccessToken",
  "AuthorizationCode",
  "RefreshToken",
  "DeviceCode",
  "ClientCredentials",
  "Client",
  "InitialAccessToken",
  "RegistrationAccessToken",
  "Interaction",
  "ReplayDetection",
  "PushedAuthorizationRequest",
];

export const OIDCGrantModelNames: ReadonlyArray<OIDCModelName> = [
  "AccessToken",
  "AuthorizationCode",
  "RefreshToken",
  "DeviceCode",
];

import { ParameterizedContext, BaseContext } from "koa";
import { ClientMetadata } from "oidc-provider";
import { IAMServerRequestContextProps } from "../../server";
import { OIDCProviderContextProxy } from "./context";
import { OIDCError } from "./error.types";
import { OIDCAccountClaims } from "./identity.types";
import { ParsedLocale } from "./proxy";
import { DeviceInfo, DiscoveryMetadata, Interaction } from "./proxy.types";
import { IdentityProvider } from "../../idp";


export type ApplicationRequestContextProps = {
  op: OIDCProviderContextProxy;
  idp: IdentityProvider;
  unwrap(): BaseContext;
} & IAMServerRequestContextProps;

export interface ApplicationActionEndpoints {
  [key: string]: {
    url: string;
    method: "POST"|"GET";
    payload?: any;
    urlencoded?: boolean;
    [key: string]: any;
  };
}

export interface ApplicationSessionState {
  [key: string]: any;
}

export interface ApplicationMetadata {
  discovery: DiscoveryMetadata;
  federationProviders: readonly string[];
  mandatoryScopes: readonly string[];
  supportedScopes: { [scope: string]: string[] };
}

export interface ApplicationState {
  name: string;
  actions: ApplicationActionEndpoints;
  error?: OIDCError;

  // static metadata
  metadata: ApplicationMetadata;

  // current user-agent and session information
  locale: ParsedLocale;
  session: ApplicationSessionState;

  // current op interaction information (login, consent)
  interaction?: Interaction;
  client?: Partial<ClientMetadata>;
  user?: Partial<OIDCAccountClaims>;
  device?: DeviceInfo;
}

export type ApplicationResponse = {
  // initial html response
  state?: ApplicationState;

  // xhr ok response for session update
  session?: ApplicationSessionState;

  // xhr error response
  error?: OIDCError;

  // xhr redirect response
  redirect?: string;
};

export type ApplicationRequestContext = ParameterizedContext<any, ApplicationRequestContextProps>;

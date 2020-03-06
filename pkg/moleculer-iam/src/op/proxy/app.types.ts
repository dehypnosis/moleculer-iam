import { ParameterizedContext, BaseContext } from "koa";
import { IMiddleware } from "koa-router";
import { ClientAuthorizationState, ClientMetadata } from "oidc-provider";
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

export interface ApplicationRoutes {
  [key: string]: {
    url: string;
    method: "POST"|"GET";
    payload?: any;
    synchronous?: boolean; // require synchronous request (form submit)
    [key: string]: any;
  };
}

export type ApplicationRoutesFactory = (promptName?: string) => ApplicationRoutes;

export interface ApplicationSessionPublicState {
  [key: string]: any;
}

export interface ApplicationSessionSecretState {
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
  routes: ApplicationRoutes;
  error?: OIDCError;

  // static metadata
  metadata: ApplicationMetadata;

  // current user-agent and session information
  locale: ParsedLocale;
  session: ApplicationSessionPublicState;

  // current op interaction information (login, consent)
  interaction?: Interaction;
  client?: Partial<ClientMetadata>;
  user?: Partial<OIDCAccountClaims>;
  device?: DeviceInfo;
  authorizedClients?: (Partial<ClientMetadata> & { authorization: ClientAuthorizationState })[];
}

export type ApplicationResponse = {
  // initial html response
  state?: ApplicationState;

  // xhr ok response for session update
  session?: ApplicationSessionPublicState;

  // xhr error response
  error?: OIDCError;

  // xhr redirect response
  redirect?: string;
};

export type ApplicationRequestContext = ParameterizedContext<any, ApplicationRequestContextProps>;

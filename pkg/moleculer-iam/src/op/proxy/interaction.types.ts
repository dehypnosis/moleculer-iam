// import { ValidationRule } from "fastest-validator";
import { ParameterizedContext } from "koa";
import { ClientMetadata, InteractionResults } from "oidc-provider";
import { IAMServerRequestContextProps } from "../../server";
import { OIDCProviderContextProxy } from "./context";
import { OIDCError } from "./error.types";
import { OIDCAccountClaims } from "./identity.types";
import { ParsedLocale } from "./proxy";
import { Client, Interaction, Session, DeviceInfo, DiscoveryMetadata } from "./proxy.types";
import { Identity, IdentityProvider } from "../../idp";


export type InteractionRequestContextProps = {
  op: OIDCProviderContextProxy;
  idp: IdentityProvider;
} & IAMServerRequestContextProps;

export interface InteractionActionEndpoints {
  [key: string]: {
    url: string;
    method: "POST"|"GET";
    payload?: any;
    urlencoded?: boolean;
    [key: string]: any;
  };
}

export interface SessionState {
  [key: string]: any;
}

export interface InteractionMetadata {
  mandatoryScopes: readonly string[];
  // availableScopes: { [scope: string]: {[claim: string]: ValidationRule}};
  availableFederationProviders: readonly string[];
  discovery: DiscoveryMetadata;
  locale: ParsedLocale;
  client?: Partial<ClientMetadata>;
  user?: Partial<OIDCAccountClaims>;
  device?: DeviceInfo;
  xsrf?: string;
}

export interface InteractionState {
  name: string;
  metadata: InteractionMetadata;
  actions: InteractionActionEndpoints;
  session: SessionState;
  error?: OIDCError;
}

export type InteractionResponse = {
  // initial html response
  state?: InteractionState;

  // xhr ok response for session update
  session?: SessionState;

  // xhr error response
  error?: OIDCError;
};

export type InteractionRequestContext = ParameterizedContext<any, InteractionRequestContextProps>;

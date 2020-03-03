import { ParameterizedContext } from "koa";
import Provider, { ClientMetadata, InteractionResults } from "oidc-provider";
import { IAMServerRequestContextProps } from "../../server";
import { OIDCError } from "./error.types";
import { OIDCAccountClaims } from "./identity.types";
import { ParsedLocale } from "./proxy";
import { Client, Interaction, Session, DeviceInfo, DiscoveryMetadata } from "./proxy.types";
import { Identity, IdentityProvider } from "../../idp";

export type InteractionRequestContextProps = {
  op: {
    // response methods
    response: {
      render: (page: InteractionPage) => Promise<void>;
      renderError: (error: OIDCError) => Promise<void>;
      redirect: (url: string) => Promise<void>;
      updateSessionState: (state: Partial<SessionState>) => Promise<void>;
      updateInteractionResult: (result: Partial<InteractionResults>) => Promise<void>;
    };

    // programmable methods
    setSessionState: (fn: (prevState: SessionState) => SessionState) => Promise<SessionState>;
    url: (path: string) => string;
    namedUrl: (name: "end_session_confirm"|"code_verification") => string;

    // programmable props
    provider: Provider;
    session: Session;
    interaction?: Interaction;
    client?: Client;
    user?: Identity;
    xsrf?: string;

    // additional data
    data: {
      device?: DeviceInfo;
      user?: Partial<OIDCAccountClaims>;
      client?: Partial<ClientMetadata>;
    };
  };
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
}

export interface InteractionPage {
  name: string;
  data?: any;
  actions?: InteractionActionEndpoints;
}

export type InteractionResponse = {
  // current interaction
  page: InteractionPage;

  // current global error
  error?: OIDCError;

  // session state
  session: SessionState;

  // locale context
  locale: ParsedLocale;

  // discovery metadata
  metadata: DiscoveryMetadata;
} | { session: Partial<SessionState>; } | { error: OIDCError; };

export type InteractionRequestContext = ParameterizedContext<any, InteractionRequestContextProps>;

import { ParameterizedContext } from "koa";
import Provider, { ClientMetadata, InteractionResults } from "oidc-provider";
import { IAMServerRequestContextProps } from "../../server";
import { OIDCError } from "./error.types";
import { OIDCAccountClaims } from "./identity.types";
import { ParsedLocale } from "./proxy";
import { Client, Interaction, Session, DeviceInfo, DiscoveryMetadata } from "./proxy.types";
import { Identity, IdentityProvider } from "../../idp";
export declare type InteractionRequestContextProps = {
    op: {
        response: {
            render: (page: InteractionPage) => Promise<void>;
            renderError: (error: OIDCError) => Promise<void>;
            redirect: (url: string) => Promise<void>;
            updateSessionState: (state: Partial<SessionState>) => Promise<void>;
            updateInteractionResult: (result: Partial<InteractionResults>) => Promise<void>;
        };
        setSessionState: (fn: (prevState: SessionState) => SessionState) => Promise<SessionState>;
        url: (path: string) => string;
        namedUrl: (name: "end_session_confirm" | "code_verification") => string;
        provider: Provider;
        session: Session;
        interaction?: Interaction;
        client?: Client;
        user?: Identity;
        xsrf?: string;
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
        method: "POST" | "GET";
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
export declare type InteractionResponse = {
    page: InteractionPage;
    error?: OIDCError;
    session: SessionState;
    locale: ParsedLocale;
    metadata: DiscoveryMetadata;
} | {
    session: Partial<SessionState>;
} | {
    error: OIDCError;
};
export declare type InteractionRequestContext = ParameterizedContext<any, InteractionRequestContextProps>;

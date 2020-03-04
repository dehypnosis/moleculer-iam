import { ParameterizedContext } from "koa";
import { ClientMetadata, InteractionResults } from "oidc-provider";
import { IAMServerRequestContextProps } from "../../server";
import { OIDCError } from "./error.types";
import { OIDCAccountClaims } from "./identity.types";
import { ParsedLocale } from "./proxy";
import { Client, Interaction, Session, DeviceInfo, DiscoveryMetadata } from "./proxy.types";
import { Identity, IdentityProvider } from "../../idp";
export declare type InteractionRequestContextProps = {
    op: {
        render: (page: Partial<InteractionPage>) => Promise<void>;
        redirectWithUpdate: (promptUpdate: Partial<InteractionResults> | {
            error: string;
            error_description?: string;
        }, allowedPromptNames?: string[]) => Promise<void>;
        redirect: (url: string) => void;
        end: () => void;
        assertPrompt: (allowedPromptNames?: string[], message?: string) => void;
        setSessionState: (update: (prevState: SessionState) => SessionState) => Promise<SessionState>;
        getURL: (path: string) => string;
        getNamedURL: (name: "end_session_confirm" | "code_verification") => string;
        session: Session & {
            state: SessionState;
        };
        interaction?: Interaction;
        client?: Client;
        user?: Identity;
        metadata: InteractionMetadata;
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
export interface InteractionMetadata {
    mandatoryScopes: readonly string[];
    availableFederationProviders: readonly string[];
    discovery: DiscoveryMetadata;
    locale: ParsedLocale;
    client?: Partial<ClientMetadata>;
    user?: Partial<OIDCAccountClaims>;
    device?: DeviceInfo;
    xsrf?: string;
}
export interface InteractionPage {
    name: string;
    metadata: InteractionMetadata;
    actions: InteractionActionEndpoints;
    state: SessionState;
    error?: OIDCError;
}
export declare type InteractionResponse = {
    page: InteractionPage;
} | {
    state: Partial<SessionState>;
} | {
    error: OIDCError;
} | {};
export declare type InteractionRequestContext = ParameterizedContext<any, InteractionRequestContextProps>;

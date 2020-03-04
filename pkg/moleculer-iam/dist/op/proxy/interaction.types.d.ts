import { ParameterizedContext } from "koa";
import { ClientMetadata } from "oidc-provider";
import { IAMServerRequestContextProps } from "../../server";
import { OIDCProviderContextProxy } from "./context";
import { OIDCError } from "./error.types";
import { OIDCAccountClaims } from "./identity.types";
import { ParsedLocale } from "./proxy";
import { DeviceInfo, DiscoveryMetadata } from "./proxy.types";
import { IdentityProvider } from "../../idp";
export declare type InteractionRequestContextProps = {
    op: OIDCProviderContextProxy;
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
    [key: string]: any;
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
export interface InteractionState {
    name: string;
    metadata: InteractionMetadata;
    actions: InteractionActionEndpoints;
    session: SessionState;
    error?: OIDCError;
}
export declare type InteractionResponse = {
    state?: InteractionState;
    session?: SessionState;
    error?: OIDCError;
};
export declare type InteractionRequestContext = ParameterizedContext<any, InteractionRequestContextProps>;

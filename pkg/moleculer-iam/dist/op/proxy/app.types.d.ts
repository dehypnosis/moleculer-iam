import { ParameterizedContext, BaseContext } from "koa";
import { ClientMetadata } from "oidc-provider";
import { IAMServerRequestContextProps } from "../../server";
import { OIDCProviderContextProxy } from "./context";
import { OIDCError } from "./error.types";
import { OIDCAccountClaims } from "./identity.types";
import { ParsedLocale } from "./proxy";
import { DeviceInfo, DiscoveryMetadata, Interaction } from "./proxy.types";
import { IdentityProvider } from "../../idp";
export declare type ApplicationRequestContextProps = {
    op: OIDCProviderContextProxy;
    idp: IdentityProvider;
    unwrap(): BaseContext;
} & IAMServerRequestContextProps;
export interface ApplicationRoutes {
    [key: string]: {
        url: string;
        method: "POST" | "GET";
        payload?: any;
        synchronous?: boolean;
        [key: string]: any;
    };
}
export declare type ApplicationRoutesFactory = (promptName?: string) => ApplicationRoutes;
export interface ApplicationSessionState {
    [key: string]: any;
}
export interface ApplicationMetadata {
    discovery: DiscoveryMetadata;
    federationProviders: readonly string[];
    mandatoryScopes: readonly string[];
    supportedScopes: {
        [scope: string]: string[];
    };
}
export interface ApplicationState {
    name: string;
    routes: ApplicationRoutes;
    error?: OIDCError;
    metadata: ApplicationMetadata;
    locale: ParsedLocale;
    session: ApplicationSessionState;
    interaction?: Interaction;
    client?: Partial<ClientMetadata>;
    user?: Partial<OIDCAccountClaims>;
    device?: DeviceInfo;
}
export declare type ApplicationResponse = {
    state?: ApplicationState;
    session?: ApplicationSessionState;
    error?: OIDCError;
    redirect?: string;
};
export declare type ApplicationRequestContext = ParameterizedContext<any, ApplicationRequestContextProps>;

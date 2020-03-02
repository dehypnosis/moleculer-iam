import compose from "koa-compose";
import Router from "koa-router";
import { ParameterizedContext } from "koa";
import Provider, { ClientMetadata, InteractionResults } from "oidc-provider";
import { IAMServerRequestContextProps } from "../../server";
import { OIDCAccountClaims } from "./identity.types";
import { ParsedLocale } from "./proxy";
import { Client, Interaction, Session, DeviceInfo, DiscoveryMetadata } from "./proxy.types";
import { Identity, IdentityProvider } from "../../idp";
import { Logger } from "../../logger";
export declare type PartialInteractionRenderState = Omit<InteractionRenderState, "metadata" | "locale">;
export declare type InteractionRouteContextProps = {
    op: {
        render: (state: PartialInteractionRenderState) => Promise<void>;
        provider: Provider;
        session: Session;
        setSessionState: (state: any) => Promise<void>;
        url: (path: string) => string;
        interaction?: Interaction;
        setInteractionResult?: (result: InteractionResults) => Promise<string>;
        namedUrl: (name: "end_session_confirm" | "code_verification") => string;
        client?: Client;
        user?: Identity;
        data: {
            device?: DeviceInfo;
            user?: Partial<OIDCAccountClaims>;
            client?: Partial<ClientMetadata>;
        };
        xsrf?: string;
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
export interface InteractionRenderState {
    interaction?: {
        name: string;
        data?: any;
        actions?: InteractionActionEndpoints;
    };
    error?: {
        error: string;
        error_description?: string;
        fields?: {
            field: string;
            message: string;
            type: string;
            actual: any;
            expected: any;
        }[];
        [key: string]: any;
    };
    redirect?: string;
    locale: ParsedLocale;
    metadata: DiscoveryMetadata;
}
export declare type InteractionRouteContext = ParameterizedContext<any, InteractionRouteContextProps>;
export declare type ProviderInteractionBuilderProps = {
    logger: Logger;
    getProvider: () => Provider;
    idp: IdentityProvider;
};
export declare class ProviderInteractionBuilder {
    private readonly props;
    readonly router: Router<any, InteractionRouteContext>;
    constructor(props: ProviderInteractionBuilderProps);
    private readonly parseContext;
    private readonly commonMiddleware;
    get op(): Provider;
    get metadata(): any;
    get idp(): IdentityProvider;
    private readonly composed;
    use(...middleware: compose.Middleware<InteractionRouteContext>[]): this;
    build(): void;
    setRenderFunction(render: ProviderInteractionBuilder["render"]): void;
    private render;
    private renderError;
    private readonly renderErrorProxy;
    private renderLogout;
    private readonly logoutSourceProxy;
    private renderLogoutEnd;
    private readonly postLogoutSuccessSourceProxy;
    private renderDeviceFlow;
    private readonly deviceFlowUserCodeInputSourceProxy;
    private renderDeviceFlowConfirm;
    private readonly deviceFlowUserCodeConfirmSourceProxy;
    private renderDeviceFlowEnd;
    private readonly deviceFlowSuccessSourceProxy;
    get namedRoutesProxy(): {
        renderErrorProxy: any;
        logoutSourceProxy: any;
        postLogoutSuccessSourceProxy: any;
        deviceFlowUserCodeInputSourceProxy: any;
        deviceFlowUserCodeConfirmSourceProxy: any;
        deviceFlowSuccessSourceProxy: any;
    };
    private getPublicClientProps;
    private getPublicUserProps;
}

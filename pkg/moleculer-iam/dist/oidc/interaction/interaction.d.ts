/// <reference types="koa-bodyparser" />
/// <reference types="koa-passport" />
import Router, { IMiddleware } from "koa-router";
import compose from "koa-compose";
import { Identity, IdentityProvider } from "../../identity";
import { Logger } from "../../logger";
import { Client, Interaction, Provider, OIDCProviderDiscoveryMetadata } from "../provider";
import { IdentityFederationManager, IdentityFederationManagerOptions } from "./federation";
import { InteractionActionEndpoints, InteractionRenderer, InteractionRendererAdapter } from "./interaction.render";
export declare type InteractionMiddlewareProps = {
    logger: Logger;
    router: Router<any, any>;
    parseContext: IMiddleware;
    render: InteractionRenderer["render"];
    actions: {
        [name: string]: InteractionActionEndpoints;
    };
    provider: Provider;
    url: (path: string) => string;
    idp: IdentityProvider;
    federation: InstanceType<typeof IdentityFederationManager>;
    federationCallbackURL: (provider: string) => string;
    devModeEnabled: boolean;
};
export declare type InteractionMiddleware = (props: InteractionMiddlewareProps) => void;
export declare type InteractionFactoryProps = {
    idp: IdentityProvider;
    logger: Logger;
    metadata: OIDCProviderDiscoveryMetadata;
    devModeEnabled: boolean;
};
export declare type InteractionFactoryOptions = {
    federation?: IdentityFederationManagerOptions;
    renderer?: InteractionRendererAdapter;
};
export declare type InteractionRequestContext = {
    interaction: Interaction;
    user?: Identity;
    client?: Client;
};
export declare class InteractionFactory {
    protected readonly props: InteractionFactoryProps;
    protected readonly opts: InteractionFactoryOptions;
    private readonly renderer;
    private readonly internal;
    constructor(props: InteractionFactoryProps, opts?: InteractionFactoryOptions);
    configuration(): any;
    routes(provider: Provider): compose.ComposedMiddleware<import("koa").ParameterizedContext<any, Router.IRouterParamContext<any, {}>>>;
}

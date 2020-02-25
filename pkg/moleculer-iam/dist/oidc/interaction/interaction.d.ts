/// <reference types="koa-bodyparser" />
/// <reference types="koa-passport" />
import Router, { IMiddleware } from "koa-router";
import compose from "koa-compose";
import { Identity, IdentityProvider } from "../../identity";
import { Logger } from "../../logger";
import { Client, Interaction, Provider } from "../provider";
import { IdentityFederationManager, IdentityFederationManagerOptions } from "./federation";
import { InteractionRenderer, InteractionRendererAdaptor } from "./interaction.render";
export declare type InteractionMiddlewareProps = {
    logger: Logger;
    router: Router<any, any>;
    parseContext: IMiddleware;
    render: InteractionRenderer["render"];
    provider: Provider;
    url: (path: string) => string;
    idp: IdentityProvider;
    federation: InstanceType<typeof IdentityFederationManager>;
    federationCallbackURL: (path: string) => string;
    devModeEnabled: boolean;
};
export declare type InteractionMiddleware = (props: InteractionMiddlewareProps) => void;
export declare type InteractionFactoryProps = {
    idp: IdentityProvider;
    logger: Logger;
};
export declare type InteractionFactoryOptions = {
    federation: IdentityFederationManagerOptions;
    renderer?: InteractionRendererAdaptor;
    devModeEnabled?: boolean;
};
export declare type InteractionRequestContext = {
    interaction: Interaction;
    user?: Identity;
    client?: Client;
};
export declare class InteractionFactory {
    protected readonly props: InteractionFactoryProps;
    protected readonly opts: Partial<InteractionFactoryOptions>;
    private readonly renderer;
    private readonly internal;
    private readonly devModeEnabled;
    constructor(props: InteractionFactoryProps, opts?: Partial<InteractionFactoryOptions>);
    configuration(): any;
    routes(provider: Provider): compose.ComposedMiddleware<import("koa").ParameterizedContext<any, Router.IRouterParamContext<any, {}>>>;
}

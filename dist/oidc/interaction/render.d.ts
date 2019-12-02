/// <reference types="koa-bodyparser" />
import Router, { RouterContext } from "koa-router";
import { Logger } from "../../logger";
export declare type ClientApplicationRendererProps = {
    logger: Logger;
};
export declare type ClientApplicationRendererOptions = {
    renderHTML?: ClientApplicationRenderHTML;
};
export declare type ClientApplicationRenderHTML = (props: ClientApplicationProps) => Promise<string> | string;
export declare type ClientApplicationProps = {
    context: ClientApplicationContext;
    action?: {
        [key in string]: {
            url: string;
            method: "POST" | "GET" | "DELETE";
            data: any;
        };
    } | null;
    data?: any;
    error?: any;
};
export declare type ClientApplicationContext = {
    interaction_id?: string;
    account_id?: string;
    client?: {
        client_id: string;
        [key: string]: any;
    };
    prompt: {
        name: string;
        details?: any;
        reasons?: string[];
    };
    params: any;
};
export declare class ClientApplicationRenderer {
    protected readonly props: ClientApplicationRendererProps;
    private readonly renderHTML;
    constructor(props: ClientApplicationRendererProps, opts?: ClientApplicationRendererOptions);
    private static readonly defaultRenderHTML;
    assetsRoutes(): import("koa-compose").Middleware<import("koa").ParameterizedContext<any, Router.IRouterParamContext<any, {}>>> | undefined;
    render(ctx: RouterContext, props?: ClientApplicationProps): Promise<void>;
}

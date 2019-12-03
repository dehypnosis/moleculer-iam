import Router, { RouterContext } from "koa-router";
import { Logger } from "../../logger";
export declare type ClientApplicationRendererProps = {
    logger: Logger;
};
export declare type ClientApplicationRendererOptions = {
    renderHTML?: ClientApplicationRenderHTML;
    assetsRoutePrefix?: string;
    assetsDirAbsolutePath?: string;
    assetsCacheMaxAge?: number;
    isValidPath?: (path: string) => Promise<boolean> | boolean;
};
export declare type ClientApplicationRenderHTML = (props?: ClientApplicationProps) => Promise<string> | string;
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
    readonly routes?: Router.IMiddleware<any, any>;
    private readonly isValidPath;
    constructor(props: ClientApplicationRendererProps, opts?: ClientApplicationRendererOptions);
    render(ctx: RouterContext, props: ClientApplicationProps | null): Promise<void>;
}

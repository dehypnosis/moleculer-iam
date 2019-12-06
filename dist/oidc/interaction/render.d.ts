import Router, { RouterContext } from "koa-router";
import { Logger } from "../../logger";
import { KoaContextWithOIDC } from "../provider";
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
export interface ClientApplicationInteractionProps {
    name: string;
    action?: {
        [key in string]: {
            url: string;
            method: string;
            data?: any;
            urlencoded?: boolean;
        };
    };
    data?: any;
}
export interface ClientApplicationError {
    name: string;
    message: string;
    status?: number;
    detail?: any;
}
export declare type ClientApplicationProps = {
    error?: ClientApplicationError;
    interaction?: ClientApplicationInteractionProps;
    redirect?: string;
};
export declare class ClientApplicationRenderer {
    protected readonly props: ClientApplicationRendererProps;
    private readonly renderHTML;
    readonly routes?: Router.IMiddleware<any, any>;
    private readonly isValidPath;
    constructor(props: ClientApplicationRendererProps, opts?: ClientApplicationRendererOptions);
    private static normalizeError;
    render(ctx: RouterContext | KoaContextWithOIDC, props?: Omit<ClientApplicationProps, "error"> & {
        error?: any;
    }): Promise<string | void | (Pick<ClientApplicationProps, "interaction" | "redirect"> & {
        error?: any;
    })>;
}

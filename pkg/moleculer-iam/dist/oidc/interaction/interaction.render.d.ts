import { RouterContext } from "koa-router";
import * as compose from "koa-compose";
import { KoaContextWithOIDC, OIDCProviderDiscoveryMetadata } from "../provider";
import { InteractionFactoryProps } from "./interaction";
export declare type InteractionRendererProps = {
    adapter: InteractionRendererAdapter;
} & InteractionFactoryProps;
export interface InteractionRendererAdapter {
    routes(dev: boolean): compose.Middleware<any>[];
    render(state: InteractionRenderState, dev: boolean): string | Promise<string>;
}
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
    metadata?: OIDCProviderDiscoveryMetadata;
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
}
export declare class InteractionRenderer {
    private readonly props;
    static contentTypes: {
        JSON: string;
        HTML: string;
    };
    constructor(props: InteractionRendererProps);
    routes(): compose.Middleware<any>[];
    render(ctx: KoaContextWithOIDC | RouterContext, state: InteractionRenderState): Promise<void>;
}

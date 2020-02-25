import { RouterContext } from "koa-router";
import compose from "koa-compose";
import { Logger } from "../../logger";
import { KoaContextWithOIDC, OIDCProviderDiscoveryMetadata } from "../provider";
export declare type InteractionRendererProps = {
    adaptor?: InteractionRendererAdaptor;
    logger: Logger;
    devModeEnabled: boolean;
};
export interface InteractionRendererAdaptor {
    routes(dev: boolean): compose.Middleware<any>[];
    render(props: InteractionRenderProps, dev: boolean): string | Promise<string>;
}
export interface InteractionRenderProps {
    interaction?: {
        name: string;
        actions?: {
            [key: string]: {
                url: string;
                method: "POST" | "GET";
                payload?: any;
                urlencoded?: boolean;
            };
        };
        data?: any;
    };
    metadata?: OIDCProviderDiscoveryMetadata;
    error?: {
        error?: string;
        error_description?: string;
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
    render(ctx: KoaContextWithOIDC | RouterContext, props?: InteractionRenderProps): Promise<void>;
}

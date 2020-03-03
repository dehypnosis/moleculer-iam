/// <reference types="koa-bodyparser" />
/// <reference types="koa-passport" />
import * as compose from "koa-compose";
import { Logger } from "../../logger";
import { InteractionRequestContext, InteractionResponse, DiscoveryMetadata } from "../proxy";
export interface InteractionRenderer {
    routes(props: InteractionRendererProps): compose.Middleware<InteractionRequestContext>[];
    render(ctx: InteractionRequestContext, response: InteractionResponse, props: InteractionRendererProps): Promise<void>;
}
export declare type InteractionRendererProps = {
    logger: Logger;
    prefix: string;
    dev: boolean;
    metadata: DiscoveryMetadata;
};
export declare class InteractionRendererFactory {
    private readonly props;
    static contentTypes: {
        JSON: string;
        HTML: string;
    };
    private readonly renderer;
    constructor(props: InteractionRendererProps, renderer?: InteractionRenderer);
    create(): {
        routes: compose.Middleware<import("koa").ParameterizedContext<any, import("../proxy").InteractionRequestContextProps>>[];
        render: (ctx: import("koa").ParameterizedContext<any, import("../proxy").InteractionRequestContextProps>, res: InteractionResponse) => Promise<void>;
    };
}

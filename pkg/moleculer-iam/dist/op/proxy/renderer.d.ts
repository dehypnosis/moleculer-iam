import * as compose from "koa-compose";
import { Logger } from "../../logger";
import { InteractionRequestContext, InteractionResponse } from "./index";
export declare type InteractionPageRendererProps = {
    logger: Logger;
    prefix: string;
    dev: boolean;
};
export interface InteractionPageRenderer {
    routes?(): compose.Middleware<InteractionRequestContext>[];
    render(ctx: InteractionRequestContext, response: InteractionResponse): Promise<void>;
}
export interface InteractionPageRendererFactoryOptions {
}
export declare type InteractionPageRendererFactory<T extends InteractionPageRendererFactoryOptions = any> = (props: InteractionPageRendererProps, options?: T) => InteractionPageRenderer;
export declare const dummyInteractionPageRendererFactory: InteractionPageRendererFactory;

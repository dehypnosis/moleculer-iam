import * as compose from "koa-compose";
import { Logger } from "../../logger";
import { InteractionState, InteractionRequestContext } from "./index";
export declare type InteractionStateRendererProps = {
    logger: Logger;
    prefix: string;
    dev: boolean;
};
export interface InteractionStateRenderer {
    routes?(): compose.Middleware<InteractionRequestContext>[];
    render(ctx: InteractionRequestContext, state: InteractionState): Promise<void>;
}
export interface InteractionStateRendererFactoryOptions {
}
export declare type InteractionStateRendererFactory<T extends InteractionStateRendererFactoryOptions = any> = (props: InteractionStateRendererProps, options?: T) => InteractionStateRenderer;
export declare const dummyInteractionStateRendererFactory: InteractionStateRendererFactory;

import Koa from "koa";
import { Logger } from "../../logger";
import { ApplicationState } from "./index";
export declare type ApplicationRendererProps = {
    logger: Logger;
    prefix: string;
    dev: boolean;
};
export interface ApplicationRenderer {
    routes?(): Koa.Middleware[];
    render(ctx: Koa.BaseContext, state: ApplicationState): Promise<void>;
}
export interface ApplicationRendererFactoryFactoryOptions {
}
export declare type ApplicationRendererFactory<T extends ApplicationRendererFactoryFactoryOptions = any> = (props: ApplicationRendererProps, options?: T) => ApplicationRenderer;
export declare const dummyAppStateRendererFactory: ApplicationRendererFactory;

import { IdentityProvider } from "../../identity";
import { Logger } from "../../logger";
import { Provider, Configuration } from "../provider";
import { ClientApplicationRenderer } from "./render";
export declare type InteractionFactoryProps = {
    identity: IdentityProvider;
    renderer: ClientApplicationRenderer;
    logger: Logger;
};
export declare class InteractionFactory {
    protected readonly props: InteractionFactoryProps;
    private readonly validator;
    private readonly router;
    constructor(props: InteractionFactoryProps);
    interactions(): Configuration["interactions"];
    routes(provider: Provider): import("koa-compose").Middleware<any>;
}

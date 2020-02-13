import { Identity, IdentityProvider } from "../../identity";
import { Logger } from "../../logger";
import { Client, Interaction, Provider } from "../provider";
import { IdentityFederationManagerOptions } from "./federation";
import { InteractionRenderer } from "./interaction.render";
export declare type InteractionFactoryProps = {
    idp: IdentityProvider;
    logger: Logger;
};
export declare type InteractionFactoryOptions = {
    federation: IdentityFederationManagerOptions;
    devModeEnabled?: boolean;
    render?: InteractionRenderer;
};
export declare type InteractionRequestContext = {
    interaction: Interaction;
    user?: Identity;
    client?: Client;
};
export declare class InteractionFactory {
    protected readonly props: InteractionFactoryProps;
    protected readonly opts: Partial<InteractionFactoryOptions>;
    private readonly router;
    private readonly render;
    private readonly internal;
    constructor(props: InteractionFactoryProps, opts?: Partial<InteractionFactoryOptions>);
    configuration(): any;
    routes(provider: Provider): import("koa-compose").Middleware<any>;
}

import { Context } from "koa";
import { Identity, IdentityProvider } from "../../identity";
import { Logger } from "../../logger";
import { IdentityFederationManagerOptions } from "./federation.presets";
export * from "./federation.presets";
export declare type IdentityFederationManagerProps = {
    idp: IdentityProvider;
    callbackURL: (provider: string) => string;
    logger?: Logger;
};
export declare class IdentityFederationManager {
    protected readonly props: IdentityFederationManagerProps;
    private readonly logger;
    private readonly passport;
    private readonly scopes;
    private readonly callbacks;
    constructor(props: IdentityFederationManagerProps, opts?: IdentityFederationManagerOptions);
    readonly availableProviders: string[];
    request(provider: string, ctx: Context, next: () => Promise<void>): Promise<void>;
    callback(provider: string, ctx: Context, next: () => Promise<void>): Promise<Identity>;
}

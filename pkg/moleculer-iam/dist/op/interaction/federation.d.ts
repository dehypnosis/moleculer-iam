import { Context } from "koa";
import { Identity, IdentityProvider } from "../../idp";
import { Logger } from "../../logger";
import { IdentityFederationManagerOptions } from "./federation.preset";
export declare type IdentityFederationManagerProps = {
    logger: Logger;
    idp: IdentityProvider;
    callbackURL: (provider: string) => string;
};
export declare class IdentityFederationManager {
    protected readonly props: IdentityFederationManagerProps;
    private readonly logger;
    private readonly passport;
    private readonly scopes;
    private readonly callbacks;
    constructor(props: IdentityFederationManagerProps, opts?: IdentityFederationManagerOptions);
    get availableProviders(): string[];
    request(provider: string, ctx: Context, next: () => Promise<void>): Promise<void>;
    callback(provider: string, ctx: Context, next: () => Promise<void>): Promise<Identity>;
}

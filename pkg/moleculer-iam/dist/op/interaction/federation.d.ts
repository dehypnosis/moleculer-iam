import { Identity } from "../../idp";
import { InteractionRequestContext, ProviderConfigBuilder } from "../proxy";
import { IdentityFederationProviderOptions } from "./federation.preset";
export declare type IdentityFederationManagerOptions = IdentityFederationProviderOptions & {
    prefix?: string;
};
export declare type IdentityFederationManagerProps = {
    builder: ProviderConfigBuilder;
};
export declare class IdentityFederationManager {
    protected readonly builder: ProviderConfigBuilder;
    private readonly passport;
    private readonly scopes;
    private readonly callbacks;
    readonly callbackURL: (providerName: string) => string;
    readonly prefix: string;
    constructor(builder: ProviderConfigBuilder, opts?: IdentityFederationManagerOptions);
    readonly providerNames: string[];
    request(ctx: InteractionRequestContext, next: () => Promise<void>, provider: string): Promise<void>;
    callback(ctx: InteractionRequestContext, next: () => Promise<void>, provider: string): Promise<Identity>;
}

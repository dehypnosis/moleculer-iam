import { IdentityFederationManagerOptions } from "./federation.preset";
import { ProviderConfigBuilder } from "../proxy";
import { InteractionRenderer } from "./renderer";
export interface OIDCInteractionBuildOptions {
    prefix?: string;
    federation?: IdentityFederationManagerOptions;
    renderer?: InteractionRenderer;
}
export declare function buildDefaultInteractions(builder: ProviderConfigBuilder, opts?: Partial<OIDCInteractionBuildOptions>): void;

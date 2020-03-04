import { ProviderConfigBuilder } from "../proxy";
import { InteractionPageRendererFactory, InteractionPageRendererFactoryOptions } from "../proxy";
import { IdentityFederationProviderOptions } from "../federation";
import { IdentityPhoneVerificationOptions } from "./verify_phone";
import { IdentityRegisterOptions } from "./register";
export interface InteractionBuildOptions {
    prefix?: string;
    federation?: IdentityFederationProviderOptions;
    renderer?: {
        factory?: InteractionPageRendererFactory;
        options?: InteractionPageRendererFactoryOptions;
    };
    register?: IdentityRegisterOptions;
    phoneVerification?: IdentityPhoneVerificationOptions;
}
export declare function buildDefaultInteractions(builder: ProviderConfigBuilder, opts?: InteractionBuildOptions): void;

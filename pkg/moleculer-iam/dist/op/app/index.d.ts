import { ProviderConfigBuilder } from "../proxy";
import { ApplicationRendererFactory, ApplicationRendererFactoryFactoryOptions } from "../proxy";
import { IdentityFederationProviderOptions } from "./federation";
import { IdentityPhoneVerificationOptions } from "./verify_phone";
import { IdentityRegisterOptions } from "./register";
export interface ApplicationBuildOptions {
    prefix?: string;
    federation?: IdentityFederationProviderOptions;
    renderer?: {
        factory?: ApplicationRendererFactory;
        options?: ApplicationRendererFactoryFactoryOptions;
    };
    register?: IdentityRegisterOptions;
    phoneVerification?: IdentityPhoneVerificationOptions;
}
export declare function buildApplication(builder: ProviderConfigBuilder, opts?: ApplicationBuildOptions): void;

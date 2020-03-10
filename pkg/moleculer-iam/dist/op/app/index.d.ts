import { ProviderConfigBuilder } from "../proxy";
import { ApplicationRendererFactory, ApplicationRendererFactoryFactoryOptions } from "../proxy";
import { IdentityFederationProviderOptions } from "./federation";
import { IdentityEmailVerificationOptions } from "./verify_email";
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
    verifyPhone?: IdentityPhoneVerificationOptions;
    verifyEmail?: IdentityEmailVerificationOptions;
}
export declare function buildApplication(builder: ProviderConfigBuilder, opts?: ApplicationBuildOptions): void;

import { IdentityFederationManagerOptions } from "./federation";
import { ProviderConfigBuilder } from "../proxy";
import { InteractionRenderer } from "./renderer";
import { IdentityPhoneVerificationOptions } from "./routes.verify_phone";
import { IdentityRegisterOptions } from "./routes.register";
export interface InteractionBuildOptions {
    prefix?: string;
    federation?: IdentityFederationManagerOptions;
    renderer?: InteractionRenderer;
    register?: IdentityRegisterOptions;
    phoneVerification?: IdentityPhoneVerificationOptions;
}
export declare function buildDefaultInteractions(builder: ProviderConfigBuilder, opts?: InteractionBuildOptions): void;

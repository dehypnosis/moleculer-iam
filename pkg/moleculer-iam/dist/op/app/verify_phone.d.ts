import { Logger } from "../../helper/logger";
import { ProviderConfigBuilder } from "../proxy";
import { ApplicationBuildOptions } from "./index";
export declare type IdentityPhoneVerificationArgs = {
    phoneNumber: string;
    secret: string;
    language: string;
    logger: Logger;
};
export declare type IdentityPhoneVerificationOptions = {
    timeoutSeconds?: number;
    send?(args: IdentityPhoneVerificationArgs): Promise<void>;
};
export declare function buildVerifyPhoneRoutes(builder: ProviderConfigBuilder, opts: ApplicationBuildOptions): void;

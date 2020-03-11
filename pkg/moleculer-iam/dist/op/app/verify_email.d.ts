import { Logger } from "../../helper/logger";
import { ProviderConfigBuilder } from "../proxy";
import { ApplicationBuildOptions } from "./index";
export declare type IdentityEmailVerificationArgs = {
    email: string;
    secret: string;
    language: string;
    logger: Logger;
};
export declare type IdentityEmailVerificationOptions = {
    timeoutSeconds?: number;
    send?(args: IdentityEmailVerificationArgs): Promise<void>;
};
export declare function buildVerifyEmailRoutes(builder: ProviderConfigBuilder, opts: ApplicationBuildOptions): void;

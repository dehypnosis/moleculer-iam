import { ProviderConfigBuilder } from "../proxy";
import { ApplicationBuildOptions } from "./index";
export declare type IdentityRegisterOptions = {
    allowedScopes?: string[];
    forbiddenClaims?: string[];
};
export declare function buildRegisterRoutes(builder: ProviderConfigBuilder, opts: ApplicationBuildOptions): void;

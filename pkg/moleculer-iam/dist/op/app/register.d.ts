import { ProviderConfigBuilder } from "../proxy";
import { ApplicationBuildOptions } from "./index";
import { ApplicationActionEndpointGroups } from "./actions";
export declare type IdentityRegisterOptions = {
    allowedScopes?: string[];
    forbiddenClaims?: string[];
};
export declare function buildRegisterRoutes(builder: ProviderConfigBuilder, opts: ApplicationBuildOptions, actions: ApplicationActionEndpointGroups): void;

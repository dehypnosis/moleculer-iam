import { ProviderConfigBuilder } from "../proxy";
import { InteractionBuildOptions } from "./index";
import { InteractionActionEndpointGroups } from "./actions";
export declare type IdentityRegisterOptions = {
    allowedScopes?: string[];
    forbiddenClaims?: string[];
};
export declare function buildRegisterRoutes(builder: ProviderConfigBuilder, opts: InteractionBuildOptions, actions: InteractionActionEndpointGroups): void;

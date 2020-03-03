import { ProviderConfigBuilder } from "../proxy";
import { InteractionBuildOptions } from "./bootstrap";
import { InteractionActionEndpointGroups } from "./routes";
export declare type IdentityRegisterOptions = {
    allowedScopes?: string[];
    forbiddenClaims?: string[];
};
export declare function buildRegisterRoutes(builder: ProviderConfigBuilder, opts: InteractionBuildOptions, actions: InteractionActionEndpointGroups): void;

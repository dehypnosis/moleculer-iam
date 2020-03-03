import { InteractionActionEndpoints, ProviderConfigBuilder } from "../proxy";
import { InteractionBuildOptions } from "./bootstrap";
import { IdentityFederationManager } from "./federation";
export declare type InteractionActionEndpointGroups = {
    [group: string]: InteractionActionEndpoints;
};
export declare const buildInteractionActionEndpoints: (builder: ProviderConfigBuilder, opts: InteractionBuildOptions, federator: IdentityFederationManager) => InteractionActionEndpointGroups;

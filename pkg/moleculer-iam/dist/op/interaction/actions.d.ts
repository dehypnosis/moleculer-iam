import { InteractionActionEndpoints, ProviderConfigBuilder } from "../proxy";
import { InteractionBuildOptions } from "./index";
export declare type InteractionActionEndpointGroups = {
    [group: string]: InteractionActionEndpoints;
};
export declare const buildInteractionActionEndpoints: (builder: ProviderConfigBuilder, opts: InteractionBuildOptions) => InteractionActionEndpointGroups;

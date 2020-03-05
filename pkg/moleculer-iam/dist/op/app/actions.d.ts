import { ApplicationActionEndpoints, ProviderConfigBuilder } from "../proxy";
import { ApplicationBuildOptions } from "./index";
export declare type ApplicationActionEndpointGroups = {
    [group: string]: ApplicationActionEndpoints;
};
export declare const buildApplicationActionEndpoints: (builder: ProviderConfigBuilder, opts: ApplicationBuildOptions) => ApplicationActionEndpointGroups;

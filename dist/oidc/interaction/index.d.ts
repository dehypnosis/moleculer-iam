import { InternalInteractionConfiguration, InternalInteractionConfigurationKeys } from "./internal";
export * from "./render";
export * from "./internal";
export * from "./interaction";
export declare type InteractionConfigurationKeys = "interactions" | InternalInteractionConfigurationKeys;
export declare type InteractionConfiguration = InternalInteractionConfiguration & {
    interactions: InteractionConfiguration;
};

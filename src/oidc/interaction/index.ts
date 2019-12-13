import { InternalInteractionConfiguration, InternalInteractionConfigurationKeys } from "./internal";

export * from "./app";
export * from "./internal";
export * from "./interaction";

export type InteractionConfigurationKeys = "interactions" | InternalInteractionConfigurationKeys;
export type InteractionConfiguration = InternalInteractionConfiguration & {
  interactions: InteractionConfiguration,
};

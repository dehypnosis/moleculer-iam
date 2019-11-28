import { Configuration } from "../provider";
import { interactions } from "./interaction";
import { renderError } from "./internal/error";
import { logoutSource, postLogoutSuccessSource } from "./internal/logout";
import { successSource, userCodeConfirmSource, userCodeInputSource } from "./internal/device";

export { createInteractionRouter } from "./router";

export type UserInteractionConfigurationKeys = "interactions" | "renderError" | "logoutSource" | "postLogoutSuccessSource";
export type UserInteractionDeviceFlowConfigurationKeys = "userCodeInputSource" | "userCodeConfirmSource" | "successSource";
export type UserInteractionDeviceFlowConfiguration = Required<Required<Configuration>["features"]>["deviceFlow"];
export type UserInteractionConfiguration = {
  [key in UserInteractionConfigurationKeys]: Configuration[key];
} & {
  features: {
    deviceFlow: { [key in UserInteractionDeviceFlowConfigurationKeys]: UserInteractionDeviceFlowConfiguration[key]; };
  };
};

export const interactionConfiguration: UserInteractionConfiguration = {
  interactions,
  renderError,
  logoutSource,
  postLogoutSuccessSource,
  features: {
    deviceFlow: {
      userCodeInputSource,
      userCodeConfirmSource,
      successSource,
    },
  },
} as any;

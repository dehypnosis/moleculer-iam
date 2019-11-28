import { Configuration } from "../provider";
export { createInteractionRouter } from "./router";
export declare type UserInteractionConfigurationKeys = "interactions" | "renderError" | "logoutSource" | "postLogoutSuccessSource";
export declare type UserInteractionDeviceFlowConfigurationKeys = "userCodeInputSource" | "userCodeConfirmSource" | "successSource";
export declare type UserInteractionDeviceFlowConfiguration = Required<Required<Configuration>["features"]>["deviceFlow"];
export declare type UserInteractionConfiguration = {
    [key in UserInteractionConfigurationKeys]: Configuration[key];
} & {
    features: {
        deviceFlow: {
            [key in UserInteractionDeviceFlowConfigurationKeys]: UserInteractionDeviceFlowConfiguration[key];
        };
    };
};
export declare const interactionConfiguration: UserInteractionConfiguration;

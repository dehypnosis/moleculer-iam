import { Logger } from "../../logger";
import { Configuration } from "../provider";
import { ClientApplicationRenderer } from "./render";
export declare type InternalInteractionConfigurationFactoryProps = {
    renderer: ClientApplicationRenderer;
    logger: Logger;
};
export declare type InternalInteractionConfigurationKeys = "renderError" | "logoutSource" | "postLogoutSuccessSource";
export declare type InternalInteractionDeviceFlowConfigurationKeys = "userCodeInputSource" | "userCodeConfirmSource" | "successSource";
export declare type InternalInteractionDeviceFlowConfiguration = Required<Required<Configuration>["features"]>["deviceFlow"];
export declare type InternalInteractionConfiguration = {
    [key in InternalInteractionConfigurationKeys]: Configuration[key];
} & {
    features: {
        deviceFlow: {
            [key in InternalInteractionDeviceFlowConfigurationKeys]: InternalInteractionDeviceFlowConfiguration[key];
        };
    };
};
export declare class InternalInteractionConfigurationFactory {
    protected readonly props: InternalInteractionConfigurationFactoryProps;
    constructor(props: InternalInteractionConfigurationFactoryProps);
    configuration(): InternalInteractionConfiguration;
    private render;
}

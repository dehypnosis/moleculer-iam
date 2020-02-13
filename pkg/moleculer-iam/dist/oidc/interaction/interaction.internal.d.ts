import { Configuration } from "oidc-provider";
import { Logger } from "../../logger";
import { IdentityProvider } from "../../identity";
import { InteractionRenderer } from "./interaction.render";
export declare type InternalInteractionConfigurationFactoryProps = {
    idp: IdentityProvider;
    logger: Logger;
    render: InteractionRenderer;
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

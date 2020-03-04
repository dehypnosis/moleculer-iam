import { Logger } from "../../logger";
import { ProviderConfigBuilder } from "../proxy";
import { InteractionBuildOptions } from "./index";
import { InteractionActionEndpointGroups } from "./actions";
export declare type IdentityPhoneVerificationSendArgs = {
    phoneNumber: string;
    secret: string;
    language: string;
    logger: Logger;
};
export declare type IdentityPhoneVerificationOptions = {
    timeoutSeconds?: number;
    send?(args: IdentityPhoneVerificationSendArgs): Promise<void>;
};
export declare function buildVerifyPhoneRoutes(builder: ProviderConfigBuilder, opts: InteractionBuildOptions, actions: InteractionActionEndpointGroups): void;

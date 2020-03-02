import { Provider, Configuration } from "oidc-provider";
import { IdentityProvider } from "../../idp";
import { Logger } from "../../logger";
import { OIDCAdapterProxy, OIDCAdapterProxyConstructorOptions } from "./adapter";
import { ProviderInteractionBuilder } from "./config.interaction";
import { DiscoveryMetadata } from "./proxy.types";
declare type UnsupportedConfigurationKeys = "clients" | "claims" | "scopes" | "dynamicScopes";
declare type DynamicConfigurationKeys = "findAccount" | "extraClientMetadata" | "extraParams" | "interactions" | "routes" | "renderError" | "logoutSource" | "postLogoutSuccessSource";
declare type DeviceFlowConfigurationKeys = "userCodeInputSource" | "userCodeConfirmSource" | "successSource";
export declare type DeviceFlowConfiguration = Required<Required<Configuration>["features"]>["deviceFlow"];
declare type DynamicFeaturesConfiguration = {
    features: {
        deviceFlow: {
            [key in DeviceFlowConfigurationKeys]: DeviceFlowConfiguration[key];
        };
    };
};
export declare type DynamicConfiguration = Required<Pick<Configuration, DynamicConfigurationKeys> & DynamicFeaturesConfiguration>;
export declare type StaticConfiguration = Omit<Configuration, UnsupportedConfigurationKeys | "adapter" | "discovery"> & {
    adapter?: OIDCAdapterProxyConstructorOptions;
    discovery?: DiscoveryMetadata;
    dev?: boolean;
    issuer?: string;
};
export declare type ProviderBuilderProps = {
    logger: Logger;
    idp: IdentityProvider;
};
export declare class ProviderConfigBuilder {
    private readonly props;
    readonly logger: Logger;
    readonly staticConfig: StaticConfiguration;
    private readonly dynamicConfig;
    private readonly issuer;
    readonly dev: boolean;
    readonly adapter: OIDCAdapterProxy;
    readonly interaction: ProviderInteractionBuilder;
    readonly idp: IdentityProvider;
    private provider?;
    constructor(props: ProviderBuilderProps, opts?: Partial<StaticConfiguration>);
    setPrefix(prefix: string): this;
    setFindAccount(config: DynamicConfiguration["findAccount"]): this;
    setExtraParams(config: DynamicConfiguration["extraParams"]): this;
    setExtraClientMetadata(config: DynamicConfiguration["extraClientMetadata"]): this;
    setInteractionPolicy(config: NonNullable<DynamicConfiguration["interactions"]["policy"]>): this;
    build(): Provider;
}
export {};

import { IdentityFederationProviderConfiguration, IdentityFederationProviderConfigurationMap } from "../../proxy";
import { GoogleProviderConfiguration } from "./google";
import { FacebookProviderConfiguration } from "./facebook";
import { KakaoProviderConfiguration } from "./kakao";
export interface IdentityFederationProviderConfigurationMapPreset extends IdentityFederationProviderConfigurationMap {
    google: GoogleProviderConfiguration;
    facebook: FacebookProviderConfiguration;
    kakao: KakaoProviderConfiguration;
}
declare type WithPreset<P extends IdentityFederationProviderConfiguration<any, any>> = Partial<P> & Pick<P, "clientID" | "clientSecret">;
export declare type IdentityFederationProviderOptions = {
    [P in keyof IdentityFederationProviderConfigurationMapPreset]?: WithPreset<IdentityFederationProviderConfigurationMapPreset[P]>;
} & {
    [P in any]: P extends keyof IdentityFederationProviderConfigurationMapPreset ? WithPreset<IdentityFederationProviderConfigurationMapPreset[P]> | undefined : IdentityFederationProviderConfiguration<any, any>;
};
export declare const identityFederationProviderOptionsPreset: IdentityFederationProviderOptions;
export {};

import { IdentityFederationProviderConfiguration, IdentityFederationProviderConfigurationMap } from "../../proxy";
import { googleProviderConfiguration, GoogleProviderConfiguration } from "./google";
import { facebookProviderConfiguration, FacebookProviderConfiguration } from "./facebook";
import { kakaoProviderConfiguration, KakaoProviderConfiguration } from "./kakao";

export interface IdentityFederationProviderConfigurationMapPreset extends IdentityFederationProviderConfigurationMap {
  google: GoogleProviderConfiguration;
  facebook: FacebookProviderConfiguration;
  kakao: KakaoProviderConfiguration;
}

type WithPreset<P extends IdentityFederationProviderConfiguration<any, any>> = Partial<P> & Pick<P, "clientID"|"clientSecret">;

export type IdentityFederationProviderOptions = {
  [P in keyof IdentityFederationProviderConfigurationMapPreset]?: WithPreset<IdentityFederationProviderConfigurationMapPreset[P]>;
} & {
  [P in any]: P extends keyof IdentityFederationProviderConfigurationMapPreset
    ? WithPreset<IdentityFederationProviderConfigurationMapPreset[P]> | undefined
    : IdentityFederationProviderConfiguration<any, any>;
};

export const identityFederationProviderOptionsPreset: IdentityFederationProviderOptions = {
  google: googleProviderConfiguration,
  facebook: facebookProviderConfiguration,
  kakao: kakaoProviderConfiguration,
};


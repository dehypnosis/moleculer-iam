import { IdentityFederationProviderConfiguration, IdentityFederationProviderConfigurationMap } from "../../proxy";
import { googleProviderConfiguration, GoogleProviderConfiguration } from "./google";
import { facebookProviderConfiguration, FacebookProviderConfiguration } from "./facebook";
import { kakaoProviderConfiguration, KakaoProviderConfiguration } from "./kakao";
import { appleProviderConfiguration, AppleProviderConfiguration } from "./apple";

export interface IdentityFederationProviderConfigurationMapPreset extends IdentityFederationProviderConfigurationMap {
  google: GoogleProviderConfiguration;
  facebook: FacebookProviderConfiguration;
  kakao: KakaoProviderConfiguration;
  apple: AppleProviderConfiguration;
}

type WithPreset<P extends IdentityFederationProviderConfiguration<any, any>> = Partial<P> & Pick<P, "clientID">;

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
  apple: appleProviderConfiguration
};


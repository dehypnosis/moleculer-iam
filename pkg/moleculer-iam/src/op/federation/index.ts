import { IdentityFederationProviderConfigurationMap } from "../proxy";
import { googleProviderConfiguration, GoogleProviderConfiguration } from "./google";
import { facebookProviderConfiguration, FacebookProviderConfiguration } from "./facebook";
import { kakaoProviderConfiguration, KakaoProviderConfiguration } from "./kakao";

export type IdentityFederationProviderOptions = IdentityFederationProviderConfigurationMap & {
  google?: Partial<GoogleProviderConfiguration>;
  facebook?: Partial<FacebookProviderConfiguration>;
  kakao?: Partial<KakaoProviderConfiguration>;
}

export const identityFederationProviderOptionsPreset: IdentityFederationProviderOptions = {
  google: googleProviderConfiguration,
  facebook: facebookProviderConfiguration,
  kakao: kakaoProviderConfiguration,
};

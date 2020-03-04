import { IdentityFederationProviderConfigurationMap } from "../proxy";
import { GoogleProviderConfiguration } from "./google";
import { FacebookProviderConfiguration } from "./facebook";
import { KakaoProviderConfiguration } from "./kakao";
export declare type IdentityFederationProviderOptions = IdentityFederationProviderConfigurationMap & {
    google?: Partial<GoogleProviderConfiguration>;
    facebook?: Partial<FacebookProviderConfiguration>;
    kakao?: Partial<KakaoProviderConfiguration>;
};
export declare const identityFederationProviderOptionsPreset: IdentityFederationProviderOptions;

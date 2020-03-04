import { IdentityFederationProviderConfigurationMap } from "../proxy";
import { KakaoProviderConfiguration } from "./federation.kakao";
export declare type IdentityFederationProviderOptions = IdentityFederationProviderConfigurationMap & {
    kakao?: KakaoProviderConfiguration;
};

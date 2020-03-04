import { StrategyOption, Profile } from "passport-kakao";
import { IdentityFederationProviderConfiguration } from "../proxy";
export declare type KakaoProviderConfiguration = Partial<IdentityFederationProviderConfiguration<Profile, StrategyOption>>;
export declare const kakaoProviderConfiguration: KakaoProviderConfiguration;

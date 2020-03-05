import { IOAuth2StrategyOption as StrategyOption, Profile } from "passport-google-oauth";
import { IdentityFederationProviderConfiguration } from "../../proxy";
export declare type GoogleProviderConfiguration = IdentityFederationProviderConfiguration<Profile, StrategyOption>;
export declare const googleProviderConfiguration: GoogleProviderConfiguration;

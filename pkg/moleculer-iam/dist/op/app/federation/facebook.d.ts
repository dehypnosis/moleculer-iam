import { StrategyOption, Profile } from "passport-facebook";
import { IdentityFederationProviderConfiguration } from "../../proxy";
export declare type FacebookProviderConfiguration = IdentityFederationProviderConfiguration<Profile, StrategyOption>;
export declare const facebookProviderConfiguration: FacebookProviderConfiguration;

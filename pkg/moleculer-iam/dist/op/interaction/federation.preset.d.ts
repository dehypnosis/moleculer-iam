import { Profile, Strategy } from "passport";
import { Logger } from "../../logger";
import { Identity, IdentityProvider } from "../../idp";
import { IOAuth2StrategyOption as GoogleOptions } from "passport-google-oauth";
import { StrategyOption as KakaoOptions } from "passport-kakao";
import { StrategyOption as FacebookOptions } from "passport-facebook";
export declare type IdentityFederationCallback = (args: {
    idp: IdentityProvider;
    profile: Profile;
    accessToken: string;
    scope: string[];
    logger: Logger;
}) => Promise<Identity | void>;
export declare type IdentityFederationProviderOptions = {
    kakao?: Partial<Omit<KakaoOptions, "callbackURL"> & {
        scope: string | string[];
        callback: IdentityFederationCallback;
    }>;
    google?: Partial<Omit<GoogleOptions, "callbackURL"> & {
        scope: string | string[];
        callback: IdentityFederationCallback;
    }>;
    facebook?: Partial<Omit<FacebookOptions, "callbackURL"> & {
        scope: string | string[];
        callback: IdentityFederationCallback;
    }>;
} & {
    [key: string]: {
        scope: string | string[];
        callback: IdentityFederationCallback;
        [key: string]: any;
    };
};
export declare const defaultIdentityFederationProviderStrategies: {
    [provider: string]: new (opts: any, callback: any) => Strategy;
};
export declare const defaultIdentityFederationProviderOptions: IdentityFederationProviderOptions;

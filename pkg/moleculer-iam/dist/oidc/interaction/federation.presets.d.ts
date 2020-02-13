import { Profile, Strategy } from "passport";
import { Identity, IdentityProvider } from "../../identity";
import { Logger } from "../../logger";
import { IOAuth2StrategyOption as GoogleOptions } from "passport-google-oauth";
import { StrategyOption as KakaoOptions } from "passport-kakao";
import { StrategyOption as FacebookOptions } from "passport-facebook";
export declare type FederationCallback = (args: {
    idp: IdentityProvider;
    profile: Profile;
    accessToken: string;
    scope: string[];
    logger: Logger;
}) => Promise<Identity | void>;
export declare type IdentityFederationManagerOptions = {
    kakao?: Partial<Omit<KakaoOptions, "callbackURL"> & {
        scope: string | string[];
        callback: FederationCallback;
    }>;
    google?: Partial<Omit<GoogleOptions, "callbackURL"> & {
        scope: string | string[];
        callback: FederationCallback;
    }>;
    facebook?: Partial<Omit<FacebookOptions, "callbackURL"> & {
        scope: string | string[];
        callback: FederationCallback;
    }>;
} & {
    [key: string]: {
        scope: string | string[];
        callback: FederationCallback;
        [key: string]: any;
    };
};
export declare const Strategies: {
    [provider: string]: new (opts: any, callback: any) => Strategy;
};
export declare const defaultIdentityFederationManagerOptions: IdentityFederationManagerOptions;

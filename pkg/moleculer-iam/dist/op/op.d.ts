import { IdentityProvider } from "../idp";
import { Logger } from "../helper/logger";
import { OIDCProviderProxy, OIDCProviderProxyOptions } from "./proxy";
export declare type OIDCProviderProps = {
    logger: Logger;
    idp: IdentityProvider;
};
export declare type OIDCProviderOptions = OIDCProviderProxyOptions;
export interface OIDCProvider extends OIDCProviderProxy {
}
export declare class OIDCProvider {
    private readonly props;
    static modelNames: readonly import("./proxy").OIDCModelName[];
    static volatileModelNames: readonly import("./proxy").OIDCModelName[];
    private readonly logger;
    private readonly idp;
    private readonly proxy;
    constructor(props: OIDCProviderProps, options: OIDCProviderOptions);
    private working;
    start(): Promise<void>;
    stop(): Promise<void>;
}

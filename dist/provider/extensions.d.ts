import { Provider } from "oidc-provider";
import { Logger } from "../logger";
export declare type OIDCProviderExtension = {
    [key in "disable-implicit-force-https" | "disable-implicit-forbid-localhost"]: boolean;
};
export declare function extendOIDCProvider(provider: Provider, logger: Logger, extension: OIDCProviderExtension): void;

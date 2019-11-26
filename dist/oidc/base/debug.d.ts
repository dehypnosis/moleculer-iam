import { Provider } from "./types";
import { Logger } from "../../logger";
export declare type OIDCProviderBaseDebugOptions = {
    [key in "disable-implicit-force-https" | "disable-implicit-forbid-localhost"]: boolean;
};
export declare function applyDebugOptions(provider: Provider, logger: Logger, options: OIDCProviderBaseDebugOptions): void;

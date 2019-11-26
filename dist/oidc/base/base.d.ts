/// <reference types="node" />
import { AdapterPayload } from "oidc-provider";
import { Logger } from "../../logger";
import { OIDCModelName, Provider as OriginalProvider } from "./types";
import { OIDCAdapterConstructorOptions, OIDCModel, OIDCModelPayload } from "../adapter";
import { OIDCProviderBaseOptions } from "./options";
export declare type OIDCProviderBaseProps = {
    issuer: string;
    adapter?: OIDCAdapterConstructorOptions;
    logger?: Logger;
    trustProxy?: boolean;
};
export declare class OIDCProviderBase {
    private readonly props;
    readonly logger: Logger;
    readonly models: Map<string, OIDCModel>;
    private readonly adapter;
    readonly original: OriginalProvider;
    readonly originalMap: any;
    constructor(props: OIDCProviderBaseProps, options?: OIDCProviderBaseOptions);
    getModel<T extends OIDCModelPayload = AdapterPayload>(name: OIDCModelName): OIDCModel<T>;
    get httpRequestHandler(): (req: import("http").IncomingMessage | import("http2").Http2ServerRequest, res: import("http").ServerResponse | import("http2").Http2ServerResponse) => void;
    start(): Promise<void>;
    stop(): Promise<void>;
}

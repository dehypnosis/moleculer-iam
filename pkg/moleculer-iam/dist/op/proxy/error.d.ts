import { OIDCError } from "../proxy";
declare class OIDCProviderProxyError implements OIDCError {
    readonly status: number;
    readonly error: string;
    readonly error_description: string | undefined;
    constructor(status: number, error: string, error_description: string | undefined);
}
declare class InvalidPromptSession extends OIDCProviderProxyError {
    constructor();
}
declare class InvalidFederationProvider extends OIDCProviderProxyError {
    constructor();
}
declare class FederationRequestWithoutEmailPayload extends OIDCProviderProxyError {
    constructor();
}
declare class FederationRequestForDeletedAccount extends OIDCProviderProxyError {
    constructor();
}
export declare const OIDCProviderProxyErrors: {
    OIDCProviderProxyError: typeof OIDCProviderProxyError;
    InvalidPromptSession: typeof InvalidPromptSession;
    InvalidFederationProvider: typeof InvalidFederationProvider;
    FederationRequestWithoutEmailPayload: typeof FederationRequestWithoutEmailPayload;
    FederationRequestForDeletedAccount: typeof FederationRequestForDeletedAccount;
};
export {};

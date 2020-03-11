"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class OIDCProviderProxyError {
    constructor(status, error, error_description) {
        this.status = status;
        this.error = error;
        this.error_description = error_description;
    }
}
class InvalidPromptSession extends OIDCProviderProxyError {
    constructor() {
        super(400, "InvalidPromptSession", "The login session has expired or invalid.");
    }
}
class InvalidFederationProvider extends OIDCProviderProxyError {
    constructor() {
        super(400, "InvalidFederationProvider", "Cannot federate account with the invalid provider.");
    }
}
class FederationRequestWithoutEmailPayload extends OIDCProviderProxyError {
    constructor() {
        super(400, "FederationRequestWithoutEmailPayload", "Cannot federate without an email address.");
    }
}
class FederationRequestForDeletedAccount extends OIDCProviderProxyError {
    constructor() {
        super(400, "FederationRequestForDeletedAccount", "Cannot federate a deleted account.");
    }
}
exports.OIDCProviderProxyErrors = {
    OIDCProviderProxyError,
    InvalidPromptSession,
    InvalidFederationProvider,
    FederationRequestWithoutEmailPayload,
    FederationRequestForDeletedAccount,
};
//# sourceMappingURL=error.js.map
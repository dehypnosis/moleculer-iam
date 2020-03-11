"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class IdentityProviderError {
    constructor(status, error, error_description) {
        this.status = status;
        this.error = error;
        this.error_description = error_description;
    }
}
class IdentityAlreadyExistsError extends IdentityProviderError {
    constructor() {
        super(400, "IdentityAlreadyExists", "The account already exists.");
    }
}
class IdentityNotExistsError extends IdentityProviderError {
    constructor() {
        super(400, "IdentityNotExists", "The account does not exists.");
    }
}
class InvalidCredentialsError extends IdentityProviderError {
    constructor() {
        super(400, "InvalidCredentials", "Invalid credentials.");
    }
}
class UnsupportedCredentialsError extends IdentityProviderError {
    constructor() {
        super(400, "UnsupportedCredentials", "Cannot use the given type of credentials.");
    }
}
class ValidationError extends IdentityProviderError {
    constructor(data, debug) {
        super(422, "ValidationFailed", "Failed to validate given payload.");
        this.data = data;
        this.debug = debug;
    }
}
exports.IAMErrors = {
    IdentityProviderError,
    IdentityAlreadyExistsError,
    IdentityNotExistsError,
    InvalidCredentialsError,
    UnsupportedCredentialsError,
    ValidationError,
};
//# sourceMappingURL=error.js.map
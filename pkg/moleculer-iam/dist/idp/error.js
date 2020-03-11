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
class ValidationError extends IdentityProviderError {
    constructor(data, debug) {
        super(422, "ValidationFailed", "Validation failed.");
        this.data = data;
        this.debug = debug;
    }
}
class MigrationError extends IdentityProviderError {
    constructor(desc) {
        super(500, "MigrationError", desc);
    }
}
class UnexpectedError extends IdentityProviderError {
    constructor(message = "Unexpected Error.", status = 500) {
        super(status, "UnexpectedError", message);
    }
}
class BadRequestError extends IdentityProviderError {
    constructor(message = "Bad Request", status = 400) {
        super(status, "BadRequest", message);
    }
}
exports.Errors = {
    IdentityProviderError,
    IdentityAlreadyExistsError,
    IdentityNotExistsError,
    InvalidCredentialsError,
    ValidationError,
    MigrationError,
    UnexpectedError,
    BadRequestError,
};
//# sourceMappingURL=error.js.map
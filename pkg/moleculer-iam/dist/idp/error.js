"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class IdentityProviderError {
    constructor(status, error, error_description, data = {}) {
        this.status = status;
        this.error = error;
        this.error_description = error_description;
        this.data = data;
    }
}
class IdentityAlreadyExistsError extends IdentityProviderError {
    constructor() {
        super(400, "identity_already_exists", "The account already exists.");
    }
}
class IdentityNotExistsError extends IdentityProviderError {
    constructor() {
        super(400, "identity_not_exists", "The account does not exists.");
    }
}
class InvalidCredentialsError extends IdentityProviderError {
    constructor() {
        super(400, "invalid_credentials", "Invalid credentials.");
    }
}
class ValidationError extends IdentityProviderError {
    constructor(fields, detail) {
        super(422, "validation_failed", "Validation failed.", fields);
        this.fields = fields;
    }
}
class MigrationError extends IdentityProviderError {
    constructor(desc) {
        super(500, "migration_error", desc);
    }
}
class UnexpectedError extends IdentityProviderError {
    constructor(message = "Unexpected Error.", status = 500) {
        super(status, "unexpected_error", message);
    }
}
class BadRequestError extends IdentityProviderError {
    constructor(message = "Bad Request", status = 400) {
        super(status, "bad_request", message);
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
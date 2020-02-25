"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const provider_1 = require("../oidc/provider");
// tslint:disable:max-classes-per-file
class IdentityProviderError extends provider_1.OIDCErrors.OIDCProviderError {
    constructor(status, message) {
        super(status, message);
    }
}
class IdentityAlreadyExistsError extends IdentityProviderError {
    constructor() {
        super(400, "identity_already_exists");
        this.error_description = "The account already exists.";
    }
}
class IdentityNotExistsError extends IdentityProviderError {
    constructor() {
        super(400, "identity_not_exists");
        this.error_description = "The account does not exists.";
    }
}
class InvalidCredentialsError extends IdentityProviderError {
    constructor() {
        super(400, "invalid_credentials");
        this.error_description = "Invalid credentials.";
    }
}
class ValidationError extends IdentityProviderError {
    constructor(fields, detail) {
        super(422, "validation_failed");
        this.fields = fields;
        this.error_description = "Validation failed.";
        this.error_detail = detail;
    }
}
class MigrationError extends IdentityProviderError {
    constructor(desc) {
        super(500, "migration_error");
        this.error_description = desc;
    }
}
class UnexpectedError extends IdentityProviderError {
    constructor(message, status = 500) {
        super(status, "unexpected_error");
        this.error_description = message || "Unexpected Error";
    }
}
class BadRequestError extends IdentityProviderError {
    constructor(message, status = 400) {
        super(status, "bad_request");
        this.error_description = message || "Bad Request";
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
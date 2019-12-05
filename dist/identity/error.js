"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const provider_1 = require("../oidc/provider");
class IdentityProviderError extends provider_1.OIDCErrors.OIDCProviderError {
}
exports.IdentityNotExistsError = new IdentityProviderError(400, "identity_not_exists");
exports.IdentityNotExistsError.error_description = "The account does not exists.";
exports.InvalidCredentialsError = new IdentityProviderError(400, "invalid_credentials");
exports.InvalidCredentialsError.error_description = "Invalid credentials.";
//# sourceMappingURL=error.js.map
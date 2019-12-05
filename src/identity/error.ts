import { OIDCErrors } from "../oidc/provider";

class IdentityProviderError extends OIDCErrors.OIDCProviderError {
}

export const IdentityNotExistsError =  new IdentityProviderError(400, "identity_not_exists");
IdentityNotExistsError.error_description = "The account does not exists.";

export const InvalidCredentialsError =  new IdentityProviderError(400, "invalid_credentials");
InvalidCredentialsError.error_description = "Invalid credentials.";

// tslint:disable:max-classes-per-file
// tslint:disable:variable-name
import { OIDCError } from "../op";
import { ValidationError as ValidationErrorEntry } from "../lib/validator";

class IdentityProviderError implements OIDCError {
  constructor(
      public readonly status: number,
      public readonly error: string,
      public readonly error_description: string|undefined,
    ) {
  }
}

class IdentityAlreadyExists extends IdentityProviderError {
  constructor() {
    super(400, "IdentityAlreadyExists", "The account already exists.");
  }
}

class IdentityNotExists extends IdentityProviderError {
  constructor() {
    super(400, "IdentityNotExists", "The account does not exists.");
  }
}

class InvalidCredentials extends IdentityProviderError {
  constructor() {
    super(400, "InvalidCredentials", "Invalid credentials.");
  }
}

class UnsupportedCredentials extends IdentityProviderError {
  constructor() {
    super(400, "UnsupportedCredentials", "Cannot use the given type of credentials.");
  }
}

class ValidationFailed extends IdentityProviderError {
  constructor(public readonly data: ValidationErrorEntry[], public readonly debug?: object) {
    super(422, "ValidationFailed", "Failed to validate given payload.");
  }
}

export const IAMErrors = {
  IdentityProviderError,
  IdentityAlreadyExists,
  IdentityNotExists,
  InvalidCredentials,
  UnsupportedCredentials,
  ValidationFailed,
};

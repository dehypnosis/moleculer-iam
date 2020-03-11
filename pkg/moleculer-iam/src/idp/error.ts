// tslint:disable:max-classes-per-file
// tslint:disable:variable-name
import { OIDCError } from "../op";
import { ValidationError as ValidationErrorEntry } from "../helper/validator";

class IdentityProviderError implements OIDCError {
  constructor(
      public readonly status: number,
      public readonly error: string,
      public readonly error_description: string|undefined,
    ) {
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
  constructor(public readonly data: ValidationErrorEntry[], public readonly debug?: object) {
    super(422, "ValidationFailed", "Validation failed.");
  }
}

class MigrationError extends IdentityProviderError {
  constructor(desc: string) {
    super(500, "MigrationError", desc);
  }
}

class UnexpectedError extends IdentityProviderError {
  constructor(message: string = "Unexpected Error.", status: number = 500) {
    super(status, "UnexpectedError", message);
  }
}

class BadRequestError extends IdentityProviderError {
  constructor(message: string = "Bad Request", status: number = 400) {
    super(status, "BadRequest", message);
  }
}

export const IAMErrors = {
  IdentityProviderError,
  IdentityAlreadyExistsError,
  IdentityNotExistsError,
  InvalidCredentialsError,
  UnsupportedCredentialsError,
  ValidationError,
  MigrationError,
  UnexpectedError,
  BadRequestError,
};

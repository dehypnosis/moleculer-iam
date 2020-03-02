// tslint:disable:max-classes-per-file
// tslint:disable:variable-name
import { OIDCError } from "../op";
import { ValidationError as ValidationErrorEntry } from "../validator";

class IdentityProviderError implements OIDCError {
  constructor(
      public readonly status: number,
      public readonly error: string,
      public readonly error_description: string|undefined,
      public readonly data: any = {},
    ) {
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
  constructor(public readonly fields: ValidationErrorEntry[], detail?: any) {
    super(422, "validation_failed", "Validation failed.", fields);
  }
}

class MigrationError extends IdentityProviderError {
  constructor(desc: string) {
    super(500, "migration_error", desc);
  }
}

class UnexpectedError extends IdentityProviderError {
  constructor(message: string = "Unexpected Error.", status: number = 500) {
    super(status, "unexpected_error", message);
  }
}

class BadRequestError extends IdentityProviderError {
  constructor(message: string = "Bad Request", status: number = 400) {
    super(status, "bad_request", message);
  }
}

export const Errors = {
  IdentityProviderError,
  IdentityAlreadyExistsError,
  IdentityNotExistsError,
  InvalidCredentialsError,
  ValidationError,
  MigrationError,
  UnexpectedError,
  BadRequestError,
};

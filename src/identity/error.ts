import { OIDCErrors } from "../oidc/provider";
import { ValidationError as ValidationErrorEntry } from "../validator";

// tslint:disable:max-classes-per-file

class IdentityProviderError extends OIDCErrors.OIDCProviderError {
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
  // @ts-ignore
  // tslint:disable-next-line:variable-name
  public readonly error_detail: any;
  constructor(public readonly fields: ValidationErrorEntry[], detail?: any) {
    super(422, "validation_failed");
    this.error_description = "Validation failed.";
    this.error_detail = detail;
  }
}

class MigrationError extends IdentityProviderError {
  constructor(desc: string) {
    super(500, "migration_error");
    this.error_description = desc;
  }
}

class UnexpectedError extends IdentityProviderError {
  constructor(message?: string, status: number = 500) {
    super(status, "unexpected_error");
    this.error_description = message || "Unexpected Error";
  }
}

class BadRequestError extends IdentityProviderError {
  constructor(message?: string, status: number = 400) {
    super(status, "bad_request");
    this.error_description = message || "Bad Request";
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

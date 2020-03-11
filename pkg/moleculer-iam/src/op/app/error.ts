// tslint:disable:max-classes-per-file
// tslint:disable:variable-name
import { OIDCError } from "../proxy";

class ApplicationError implements OIDCError {
  constructor(
      public readonly status: number,
      public readonly error: string,
      public readonly error_description: string|undefined,
    ) {
  }
}

class ResetPasswordSessionExpired extends ApplicationError {
  constructor() {
    super(400, "ResetPasswordSessionExpired", "The password reset session has expired or invalid.");
  }
}

class TooMuchVerificationCodeRequest extends ApplicationError {
  constructor() {
    super(400, "TooMuchVerificationCodeRequest", "Cannot resend an verification code until previous one expires.");
  }
}

class InvalidVerificationCode extends ApplicationError {
  constructor() {
    super(400, "InvalidVerificationCode", "The verification code has expired or invalid.");
  }
}

class UnauthenticatedSession extends ApplicationError {
  constructor() {
    super(400, "UnauthenticatedSession", "The session is not authenticated.");
  }
}


export const ApplicationErrors = {
  ApplicationError,
  UnauthenticatedSession,
  ResetPasswordSessionExpired,
  TooMuchVerificationCodeRequest,
  InvalidVerificationCode,
};

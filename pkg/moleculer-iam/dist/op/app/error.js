"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ApplicationError {
    constructor(status, error, error_description) {
        this.status = status;
        this.error = error;
        this.error_description = error_description;
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
exports.ApplicationErrors = {
    ApplicationError,
    UnauthenticatedSession,
    ResetPasswordSessionExpired,
    TooMuchVerificationCodeRequest,
    InvalidVerificationCode,
};
//# sourceMappingURL=error.js.map
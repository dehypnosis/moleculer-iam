import { OIDCError } from "../proxy";
declare class ApplicationError implements OIDCError {
    readonly status: number;
    readonly error: string;
    readonly error_description: string | undefined;
    constructor(status: number, error: string, error_description: string | undefined);
}
declare class ResetPasswordSessionExpired extends ApplicationError {
    constructor();
}
declare class TooMuchVerificationCodeRequest extends ApplicationError {
    constructor();
}
declare class InvalidVerificationCode extends ApplicationError {
    constructor();
}
declare class UnauthenticatedSession extends ApplicationError {
    constructor();
}
export declare const ApplicationErrors: {
    ApplicationError: typeof ApplicationError;
    UnauthenticatedSession: typeof UnauthenticatedSession;
    ResetPasswordSessionExpired: typeof ResetPasswordSessionExpired;
    TooMuchVerificationCodeRequest: typeof TooMuchVerificationCodeRequest;
    InvalidVerificationCode: typeof InvalidVerificationCode;
};
export {};

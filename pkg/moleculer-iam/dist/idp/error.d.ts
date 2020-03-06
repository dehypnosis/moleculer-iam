import { OIDCError } from "../op";
import { ValidationError as ValidationErrorEntry } from "../validator";
declare class IdentityProviderError implements OIDCError {
    readonly status: number;
    readonly error: string;
    readonly error_description: string | undefined;
    constructor(status: number, error: string, error_description: string | undefined);
}
declare class IdentityAlreadyExistsError extends IdentityProviderError {
    constructor();
}
declare class IdentityNotExistsError extends IdentityProviderError {
    constructor();
}
declare class InvalidCredentialsError extends IdentityProviderError {
    constructor();
}
declare class ValidationError extends IdentityProviderError {
    readonly entries: ValidationErrorEntry[];
    readonly debug?: object | undefined;
    readonly fields: {
        [field: string]: string;
    };
    constructor(entries: ValidationErrorEntry[], debug?: object | undefined);
}
declare class MigrationError extends IdentityProviderError {
    constructor(desc: string);
}
declare class UnexpectedError extends IdentityProviderError {
    constructor(message?: string, status?: number);
}
declare class BadRequestError extends IdentityProviderError {
    constructor(message?: string, status?: number);
}
export declare const Errors: {
    IdentityProviderError: typeof IdentityProviderError;
    IdentityAlreadyExistsError: typeof IdentityAlreadyExistsError;
    IdentityNotExistsError: typeof IdentityNotExistsError;
    InvalidCredentialsError: typeof InvalidCredentialsError;
    ValidationError: typeof ValidationError;
    MigrationError: typeof MigrationError;
    UnexpectedError: typeof UnexpectedError;
    BadRequestError: typeof BadRequestError;
};
export {};

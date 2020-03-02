import { OIDCError } from "../op";
import { ValidationError as ValidationErrorEntry } from "../validator";
declare class IdentityProviderError implements OIDCError {
    readonly status: number;
    readonly error: string;
    readonly error_description: string | undefined;
    readonly data: any;
    constructor(status: number, error: string, error_description: string | undefined, data?: any);
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
    readonly fields: ValidationErrorEntry[];
    constructor(fields: ValidationErrorEntry[], detail?: any);
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

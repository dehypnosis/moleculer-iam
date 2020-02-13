import { OIDCErrors } from "../oidc/provider";
import { ValidationError as ValidationErrorEntry } from "../validator";
declare class IdentityProviderError extends OIDCErrors.OIDCProviderError {
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
    readonly error_detail: any;
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

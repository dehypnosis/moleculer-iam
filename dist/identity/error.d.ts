import { OIDCErrors } from "../oidc/provider";
declare class IdentityProviderError extends OIDCErrors.OIDCProviderError {
}
export declare const IdentityNotExistsError: IdentityProviderError;
export declare const InvalidCredentialsError: IdentityProviderError;
export {};

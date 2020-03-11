import { ValidationRule, ValidationSchema } from "../../helper/validator";
export interface IdentityClaimsSchema extends IdentityClaimsSchemaPayload {
    version: string;
    active: boolean;
}
export interface IdentityClaimsSchemaPayload {
    scope: string;
    key: string;
    validation: ValidationRule;
    unique?: boolean;
    immutable?: boolean;
    migration?: string;
    parentVersion?: string;
    description?: string;
}
export declare const IdentityClaimsSchemaPayloadValidationSchema: ValidationSchema;

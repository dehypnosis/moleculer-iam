import { ValidationError as ValidationErrorEntry } from "fastest-validator";
import { ErrorOut, errors } from "oidc-provider";

export const OIDCErrors = errors;

export interface OIDCError extends ErrorOut {
  error: string;
  error_description?: string;
  fields?: {field: string, message: string, type: string, actual: any, expected: any}[];
  entries?: ValidationErrorEntry[];
  debug?: any;
  [key: string]: any;
}

import { ValidationError as ValidationErrorEntry } from "fastest-validator";
import { ErrorOut, errors } from "oidc-provider";

export const OIDCErrors = errors;

export interface OIDCError extends ErrorOut {
  error: string;
  error_description?: string;
  data?: ValidationErrorEntry[];
  debug?: any;
  [key: string]: any;
}

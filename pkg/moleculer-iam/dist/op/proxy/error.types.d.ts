import { ErrorOut } from "oidc-provider";
export interface OIDCError extends ErrorOut {
    error: string;
    error_description?: string;
    fields?: {
        field: string;
        message: string;
        type: string;
        actual: any;
        expected: any;
    }[];
    [key: string]: any;
}

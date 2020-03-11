"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const en = {
    error: {
        // ref: https://github.com/panva/node-oidc-provider/blob/ed81fc64b5d6119489ef1021aebd71f2db44018e/lib/helpers/err_out.js#L13
        ServerError: {
            name: "Internal Server Error",
            description: "An unexpected internal error has occurred.",
        },
        // koa
        InternalServerError: {
            name: "Internal Server Error",
            description: "An unexpected internal error has occurred.",
        },
        // ref: https://github.com/panva/node-oidc-provider/blob/master/lib/helpers/errors.js#L20
        InvalidToken: {
            name: "Invalid Token",
        },
        InvalidClientMetadata: {
            name: "Invalid Client Metadata",
        },
        InvalidScope: {
            name: "Invalid Scope",
        },
        InvalidRequest: {
            name: "Invalid Request",
        },
        SessionNotFound: {
            name: "Session Error",
            description: "Cannot find the session.",
        },
        InvalidClientAuth: {
            name: "Invalid Client Auth",
        },
        InvalidGrant: {
            name: "Invalid Grant",
        },
        // OIDCProviderProxyErrors
        InvalidPromptSession: {
            name: "Internal Error",
            description: "The login session has expired or invalid.",
        },
        InvalidFederationProvider: {
            name: "Federation Error",
            description: "Cannot federate account with the invalid provider.",
        },
        FederationRequestWithoutEmailPayload: {
            name: "Federation Error",
            description: "Cannot federate without an email address.",
        },
        FederationRequestForDeletedAccount: {
            name: "Federation Error",
            description: "Cannot federate a deleted account.",
        },
        // ApplicationErrors
        ResetPasswordSessionExpired: {
            name: "Session Error",
            description: "Reset password session has expired or incorrect.",
        },
        TooMuchVerificationCodeRequest: {
            name: "Session Error",
            description: "Cannot resend an verification code until previous one expires.",
        },
        InvalidVerificationCode: {
            name: "Validation Error",
            description: "The verification code has expired or incorrect.",
        },
        UnauthenticatedSession: {
            name: "Session Error",
            description: "The session is not authenticated.",
        },
        // IAMErrors
        IdentityNotExists: {
            name: "Validation Error",
            description: "The account not exists.",
        },
        IdentityAlreadyExists: {
            name: "Validation Error",
            description: "The account already exists.",
        },
        InvalidCredentials: {
            name: "Validation Error",
            description: "The account and credentials are incorrect.",
        },
        UnsupportedCredentials: {
            name: "Validation Error",
            description: "The account cannot use the given type of credentials.",
        },
        ValidationFailed: {
            name: "Validation Error",
            description: "Failed to validate given payload.",
            data: {
                required: "The [field] field is required.",
                string: "The [field] field must be a string.",
                stringEmpty: "The [field] field must not be empty.",
                stringMin: "The [field] field length must be greater than or equal to [expected] characters long.",
                stringMax: "The [field] field length must be less than or equal to [expected] characters long.",
                stringLength: "The [field] field length must be [expected] characters long.",
                stringPattern: "The [field] field fails to match the required pattern.",
                stringContains: "The [field] field must contain the [expected] text.",
                stringEnum: "The [field] field does not match any of the allowed values.",
                stringNumeric: "The [field] field must be a numeric string.",
                stringAlpha: "The [field] field must be an alphabetic string.",
                stringAlphanum: "The [field] field must be an alphanumeric string.",
                stringAlphadash: "The [field] field must be an alphadash string.",
                number: "The [field] field must be a number.",
                numberMin: "The [field] field must be greater than or equal to [expected].",
                numberMax: "The [field] field must be less than or equal to [expected].",
                numberEqual: "The [field] field must be equal to [expected].",
                numberNotEqual: "The [field] field can't be equal to [expected].",
                numberInteger: "The [field] field must be an integer.",
                numberPositive: "The [field] field must be a positive number.",
                numberNegative: "The [field] field must be a negative number.",
                array: "The [field] field must be an array.",
                arrayEmpty: "The [field] field must not be an empty array.",
                arrayMin: "The [field] field must contain at least [expected] items.",
                arrayMax: "The [field] field must contain less than or equal to [expected] items.",
                arrayLength: "The [field] field must contain [expected] items.",
                arrayContains: "The [field] field must contain the [expected] item.",
                arrayUnique: "The [actual] value in [field] field does not unique the [expected] values.",
                arrayEnum: "The [actual] value in [field] field does not match any of the [expected] values.",
                boolean: "The [field] field must be a boolean.",
                date: "The [field] field must be a Date.",
                dateMin: "The [field] field must be greater than or equal to [expected].",
                dateMax: "The [field] field must be less than or equal to [expected].",
                enumValue: "The [field] field value [expected] does not match any of the allowed values.",
                equalValue: "The [field] field value must be equal to [expected].",
                equalField: "The [field] field value must be equal to [expected] field value.",
                forbidden: "The [field] field is forbidden.",
                function: "The [field] field must be a function.",
                email: "The [field] field must be a valid e-mail.",
                luhn: "The [field] field must be a valid checksum luhn.",
                mac: "The [field] field must be a valid MAC address.",
                object: "The [field] must be an Object.",
                objectStrict: "The object [field] contains forbidden keys: [actual].",
                url: "The [field] field must be a valid URL.",
                uuid: "The [field] field must be a valid UUID.",
                uuidVersion: "The [field] field must be a valid UUID version provided.",
                phone: `The [field] field must be a valid phone number format.`,
                duplicate: `The [field] value is already used by other account.`,
            },
        },
    },
};
exports.capitalizeEnglish = (value) => {
    return value.charAt(0).toLocaleUpperCase() + value.slice(1);
};
exports.default = en;
//# sourceMappingURL=i18n.en.js.map
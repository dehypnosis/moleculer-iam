import { TOptions } from "i18next";
declare const en: {
    error: {
        ServerError: {
            name: string;
            description: string;
        };
        InternalServerError: {
            name: string;
            description: string;
        };
        InvalidToken: {
            name: string;
        };
        InvalidClientMetadata: {
            name: string;
        };
        InvalidScope: {
            name: string;
        };
        InvalidRequest: {
            name: string;
        };
        SessionNotFound: {
            name: string;
            description: string;
        };
        InvalidClientAuth: {
            name: string;
        };
        InvalidGrant: {
            name: string;
        };
        InvalidPromptSession: {
            name: string;
            description: string;
        };
        InvalidFederationProvider: {
            name: string;
            description: string;
        };
        FederationRequestWithoutEmailPayload: {
            name: string;
            description: string;
        };
        FederationRequestForDeletedAccount: {
            name: string;
            description: string;
        };
        ResetPasswordSessionExpired: {
            name: string;
            description: string;
        };
        TooMuchVerificationCodeRequest: {
            name: string;
            description: string;
        };
        InvalidVerificationCode: {
            name: string;
            description: string;
        };
        UnauthenticatedSession: {
            name: string;
            description: string;
        };
        IdentityNotExists: {
            name: string;
            description: string;
        };
        IdentityAlreadyExists: {
            name: string;
            description: string;
        };
        InvalidCredentials: {
            name: string;
            description: string;
        };
        UnsupportedCredentials: {
            name: string;
            description: string;
        };
        ValidationFailed: {
            name: string;
            description: string;
            data: {
                required: string;
                string: string;
                stringEmpty: string;
                stringMin: string;
                stringMax: string;
                stringLength: string;
                stringPattern: string;
                stringContains: string;
                stringEnum: string;
                stringNumeric: string;
                stringAlpha: string;
                stringAlphanum: string;
                stringAlphadash: string;
                number: string;
                numberMin: string;
                numberMax: string;
                numberEqual: string;
                numberNotEqual: string;
                numberInteger: string;
                numberPositive: string;
                numberNegative: string;
                array: string;
                arrayEmpty: string;
                arrayMin: string;
                arrayMax: string;
                arrayLength: string;
                arrayContains: string;
                arrayUnique: string;
                arrayEnum: string;
                boolean: string;
                date: string;
                dateMin: string;
                dateMax: string;
                enumValue: string;
                equalValue: string;
                equalField: string;
                forbidden: string;
                function: string;
                email: string;
                luhn: string;
                mac: string;
                object: string;
                objectStrict: string;
                url: string;
                uuid: string;
                uuidVersion: string;
                phone: string;
                duplicate: string;
            };
        };
    };
};
export declare type I18NPostProcessor = (value: string, keys: string[], options: TOptions, translator: any) => string;
export declare type I18NResource = typeof en;
export declare const capitalizeEnglish: I18NPostProcessor;
export default en;

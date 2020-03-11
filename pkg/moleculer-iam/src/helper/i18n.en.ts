import { TOptions } from "i18next";
import { ValidationErrorMessages } from "./validator";

const en = {
  error: {
    IdentityNotExists: {
      description: "The account not exists.",
    },
    IdentityAlreadyExists: {
      description: "The account already exists.",
    },
    InvalidCredentials: {
      description: "The account and credentials are incorrect.",
    },
    UnsupportedCredentials: {
      description: "The account cannot use the given type of credentials.",
    },
    ValidationFailed: {
      description: "Validation failed.",
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
      } as ValidationErrorMessages,
    },
  },
};

export type I18NPostProcessor = (value: string, keys: string[], options: TOptions, translator: any) => string;
export type I18NResource = typeof en;

export const capitalizeEnglish: I18NPostProcessor = (value) => {
  return value.charAt(0).toLocaleUpperCase() + value.slice(1);
};

export default en;

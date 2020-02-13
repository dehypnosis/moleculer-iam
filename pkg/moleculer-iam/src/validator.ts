import Validator, { ValidationSchema, ValidationError, ValidationRule, RuleObject } from "fastest-validator";
import PhoneNumber from "awesome-phonenumber";

export { Validator, ValidationSchema, ValidationError, ValidationRule, RuleObject };

// make regexp serializable
Object.defineProperty(RegExp.prototype, "toJSON", {
  value() { return this.source.toString(); },
});

export const validator = new Validator({
  messages: {
    invalidPhoneNumber: `Invalid mobile phone number format.`,
  },
});

/*
phoneNumber: {
  type: "phone",
  types: ["mobile", "fixed-line-or-mobile"], // default
  country: "KR", // default
  format: "international", // default
}
*/
validator.add("phone", ({ schema, messages }: any, field: any, context: any) => {
  context.PhoneNumber = PhoneNumber; // PhoneNumber is 3rd party library
  context.types = schema.types || ["mobile", "fixed-line-or-mobile"];
  context.country = schema.country || "KR";
  context.format = schema.format || "international";
  return {
    source: `
      if (typeof value === "string") {
        const number = value.replace(/[^0-9+]/g, " ").split(" ").filter((s) => !!s).join("")
        const phoneNumber = new context.PhoneNumber(number, context.country);
        if (phoneNumber.isPossible() && context.types.includes(phoneNumber.getType())) {
          return phoneNumber.getNumber(context.format);
        }
      }
      ${validator.makeError({ type: "invalidPhoneNumber", actual: "value", messages })}
    `,
  };
});

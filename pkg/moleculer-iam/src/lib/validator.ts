import Validator, { ValidationSchema, ValidationError, ValidationRule, RuleObject } from "fastest-validator";
import PhoneNumber from "awesome-phonenumber";

export { Validator, ValidationSchema, ValidationError, ValidationRule, RuleObject };

export const validator = new Validator();

/*
phoneNumber: {
  type: "phone",
  types: ["mobile", "fixed-line-or-mobile"], // default
  format: "international", // default
}
*/
validator.messages.phone = `The {field} field must be a valid phone number format.`;
validator.add("phone", ({ schema, messages }: any, field: any, context: any) => {
  context.PhoneNumber = PhoneNumber; // PhoneNumber is 3rd party library
  context.types = schema.types || ["mobile", "fixed-line-or-mobile"];
  context.format = schema.format || "international";
  return {
    // value: KR|1044776418 or 1044776418 or KR|+821044776418 or +8210...
    // when region code or the region number given, validate with region context
    // region number will take precedence over region code
    source: `
      if (typeof value === "string") {
        const tokens = value.trim().split("|");
        let countryCode = tokens.length > 1 ? tokens.shift() : undefined;
        const number = tokens.join("|").replace(/[^0-9+]/g, " ").split(" ").filter((s) => !!s).join("");
        if (number.startsWith("+")) countryCode = undefined;
        const phoneNumber = new context.PhoneNumber(number, countryCode);
        if (phoneNumber.isPossible() && context.types.includes(phoneNumber.getType())) {
          return phoneNumber.getNumber(context.format);
        }
      }
      ${validator.makeError({ type: "phone", actual: "value", messages })}
    `,
  };
});

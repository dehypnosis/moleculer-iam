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
  country: "KR" // default
}
*/
validator.add("phone", ({ schema, messages }: any, field: any, context: any) => {
  // ctx.request.body.phoneNumber = ctx.request.body.phoneNumber ? ctx.request.body.phoneNumber.replace(/[^0-9+]/g, " ").split(" ").filter((s: string) => !!s).join("") : "";
  // ctx.request.body.phoneNumber = phoneNumberObj!.getNumber("international");
  context.PhoneNumber = PhoneNumber;
  context.types = schema.types || ["mobile", "fixed-line-or-mobile"];
  context.country = schema.country || "KR";
  return {
    source: `
      if (typeof value === "string") {
        const sanitizedValue = value.replace(/[^0-9+]/g, " ").split(" ").filter((s) => !!s).join("")
        const phoneNumberObj = new context.PhoneNumber(value, context.country); // TODO: i18n; country code from context
        if (phoneNumberObj.isPossible() && context.types.includes(phoneNumberObj.getType())) {
          return phoneNumberObj.getNumber("international");
        }
      }
      ${validator.makeError({ type: "invalidPhoneNumber", actual: "value", messages })}
    `,
  };
});

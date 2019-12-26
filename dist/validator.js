"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fastest_validator_1 = tslib_1.__importDefault(require("fastest-validator"));
exports.Validator = fastest_validator_1.default;
const awesome_phonenumber_1 = tslib_1.__importDefault(require("awesome-phonenumber"));
// make regexp serializable
Object.defineProperty(RegExp.prototype, "toJSON", {
    value() { return this.source.toString(); },
});
exports.validator = new fastest_validator_1.default({
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
exports.validator.add("phone", ({ schema, messages }, field, context) => {
    // ctx.request.body.phoneNumber = ctx.request.body.phoneNumber ? ctx.request.body.phoneNumber.replace(/[^0-9+]/g, " ").split(" ").filter((s: string) => !!s).join("") : "";
    // ctx.request.body.phoneNumber = phoneNumberObj!.getNumber("international");
    context.PhoneNumber = awesome_phonenumber_1.default;
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
      ${exports.validator.makeError({ type: "invalidPhoneNumber", actual: "value", messages })}
    `,
    };
});
//# sourceMappingURL=validator.js.map
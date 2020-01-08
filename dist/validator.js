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
  country: "KR", // default
  format: "international", // default
}
*/
exports.validator.add("phone", ({ schema, messages }, field, context) => {
    context.PhoneNumber = awesome_phonenumber_1.default; // PhoneNumber is 3rd party library
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
      ${exports.validator.makeError({ type: "invalidPhoneNumber", actual: "value", messages })}
    `,
    };
});
//# sourceMappingURL=validator.js.map
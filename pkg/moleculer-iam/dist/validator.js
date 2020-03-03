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
  format: "international", // default
}
*/
exports.validator.add("phone", ({ schema, messages }, field, context) => {
    context.PhoneNumber = awesome_phonenumber_1.default; // PhoneNumber is 3rd party library
    context.types = schema.types || ["mobile", "fixed-line-or-mobile"];
    context.format = schema.format || "international";
    return {
        // value: KR|1044776418 or 1044776418 or KR|+821044776418 or +8210...
        // when country code or the country number given, validate with country context
        // country number will take precedence over country code
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
      ${exports.validator.makeError({ type: "invalidPhoneNumber", actual: "value", messages })}
    `,
    };
});
//# sourceMappingURL=validator.js.map
"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
const moduleName = process.argv[2] || "memory";
process.argv.splice(2, 1);
process.env.DEBUG = "oidc-provider:*";
Promise.resolve().then(() => __importStar(require("./" + moduleName)));
//# sourceMappingURL=index.js.map
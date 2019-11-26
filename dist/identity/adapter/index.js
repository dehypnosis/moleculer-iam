"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
tslib_1.__exportStar(require("./adapter"), exports);
const memory_1 = require("./memory");
const rdbms_1 = require("./rdbms");
exports.IdentityModelAdapterConstructors = {
    Memory: memory_1.IdentityModelMemoryAdapter,
    RDBMS: rdbms_1.IdentityModelRDBMSAdapter,
};
//# sourceMappingURL=index.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const memory_1 = require("./memory");
const rdbms_1 = require("./rdbms");
tslib_1.__exportStar(require("./adapter"), exports);
tslib_1.__exportStar(require("./model"), exports);
exports.OIDCAdapterProxyConstructors = {
    Memory: memory_1.OIDCMemoryAdapterProxy,
    RDBMS: rdbms_1.OIDCRDBMSAdapterProxy,
};
//# sourceMappingURL=index.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const memory_1 = require("./memory");
const rdbms_1 = require("./rdbms");
var adapter_1 = require("./adapter");
exports.IDPAdapter = adapter_1.IDPAdapter;
exports.IDPAdapterConstructors = {
    Memory: memory_1.IDP_MemoryAdapter,
    RDBMS: rdbms_1.IDP_RDBMS_Adapter,
};
//# sourceMappingURL=index.js.map
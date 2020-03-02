"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const idp_1 = require("../idp");
const adapter_spec_common_1 = require("./adapter.spec.common");
const idp = new idp_1.IdentityProvider({
    logger: console,
}, {
    adapter: {
        type: "Memory",
        options: {},
    },
});
adapter_spec_common_1.doCommonAdapterTest(idp);
//# sourceMappingURL=adapter.memory.spec.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const provider_1 = require("../provider");
const adapter_spec_common_1 = require("./adapter.spec.common");
const idp = new provider_1.IdentityProvider({
    logger: console,
}, {
    adapter: {
        type: "Memory",
        options: {},
    },
});
adapter_spec_common_1.doCommonAdapterTest(idp);
//# sourceMappingURL=adapter.memory.spec.js.map
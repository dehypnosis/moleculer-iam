"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const provider_1 = require("../provider");
const idp = new provider_1.IdentityProvider({
    logger: console,
}, {
    adapter: {
        type: "Memory",
        options: {},
    },
});
idp.start().catch(console.error);
//# sourceMappingURL=adapter.memory.js.map
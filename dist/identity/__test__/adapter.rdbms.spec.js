"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const provider_1 = require("../provider");
const adapter_spec_common_1 = require("./adapter.spec.common");
const idp = new provider_1.IdentityProvider({
    logger: console,
}, {
    adapter: {
        type: "RDBMS",
        options: {
            dialect: "mysql",
            host: "mysql-dev.internal.qmit.pro",
            database: "iam",
            username: "iam",
            password: "iam",
            sqlLogLevel: "none",
        },
    },
});
jest.setTimeout(1000 * 60 * 4);
adapter_spec_common_1.doCommonAdapterTest(idp);
//# sourceMappingURL=adapter.rdbms.spec.js.map
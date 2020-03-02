"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const idp_1 = require("../idp");
const adapter_spec_common_1 = require("./adapter.spec.common");
const env = (name, fallback) => {
    const value = process.env[name];
    return typeof value === "undefined" ? fallback : value;
};
const idp = new idp_1.IdentityProvider({
    logger: console,
}, {
    adapter: {
        type: "RDBMS",
        options: {
            dialect: env("TEST_RDBMS_DIALECT", "mysql"),
            host: env("TEST_RDBMS_HOST", "mysql-dev.internal.qmit.pro"),
            database: env("TEST_RDBMS_DATABASE", "iam"),
            username: env("TEST_RDBMS_USERNAME", "iam"),
            password: env("TEST_RDBMS_PASSWORD", "iam"),
            sqlLogLevel: env("TEST_RDBMS_LOG_LEVEL", "none"),
        },
    },
});
jest.setTimeout(1000 * 60 * 4);
adapter_spec_common_1.doCommonAdapterTest(idp);
//# sourceMappingURL=adapter.rdbms.spec.js.map
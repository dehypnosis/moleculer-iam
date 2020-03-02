"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moleculer_1 = require("moleculer");
const service_1 = require("../service");
const service_spec_common_1 = require("./service.spec.common");
const env = (name, fallback) => {
    const value = process.env[name];
    return typeof value === "undefined" ? fallback : value;
};
const adapter = {
    type: "RDBMS",
    options: {
        dialect: env("TEST_RDBMS_DIALECT", "mysql"),
        host: env("TEST_RDBMS_HOST", "mysql-dev.internal.qmit.pro"),
        database: env("TEST_RDBMS_DATABASE", "iam"),
        username: env("TEST_RDBMS_USERNAME", "iam"),
        password: env("TEST_RDBMS_PASSWORD", "iam"),
        sqlLogLevel: env("TEST_RDBMS_LOG_LEVEL", "none"),
    },
};
const broker = new moleculer_1.ServiceBroker({ logLevel: "error" });
const service = broker.createService(service_1.IAMServiceSchema({
    idp: {
        adapter,
    },
    op: {
        issuer: "http://localhost:8899",
        adapter,
    },
    server: {
        http: {
            hostname: "localhost",
            port: 8899,
        },
    },
}));
jest.setTimeout(1000 * 60 * 4);
service_spec_common_1.doCommonServiceTest(broker, service);
//# sourceMappingURL=service.rdbms.spec.js.map
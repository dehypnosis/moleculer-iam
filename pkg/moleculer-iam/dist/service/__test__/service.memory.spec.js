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
    type: "Memory",
    options: {},
};
const broker = new moleculer_1.ServiceBroker({ logLevel: "error" });
const service = broker.createService(service_1.IAMServiceSchema({
    idp: {
        adapter,
    },
    oidc: {
        issuer: "http://localhost:8898",
        adapter,
    },
    server: {
        http: {
            hostname: "localhost",
            port: 8898,
        },
    },
}));
jest.setTimeout(1000 * 60 * 4);
service_spec_common_1.doCommonServiceTest(broker, service);
//# sourceMappingURL=service.memory.spec.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moleculer_1 = require("moleculer");
const service_1 = require("./service");
describe("Test IAMService", () => {
    const broker = new moleculer_1.ServiceBroker();
    const serviceSchema = service_1.IAMServiceSchema({
        idp: {},
        oidc: { issuer: "http://localhost:8888" },
        server: {
            http: {
                hostname: "localhost",
                port: 8888,
            },
        },
    });
    const service = broker.createService(serviceSchema);
    beforeAll(() => broker.start());
    afterAll(() => broker.stop());
    it("service should be created", () => {
        expect(service).toBeDefined();
    });
    it("service should throw for iam.client.create without detailed params", () => {
        return expect(broker.call("iam.client.create", { client_id: "test" })).rejects.toThrow();
    });
});
//# sourceMappingURL=service.spec.js.map
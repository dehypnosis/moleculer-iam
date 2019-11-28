"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moleculer_1 = require("moleculer");
const provider_1 = require("../oidc/provider");
const iam_1 = require("./iam");
describe("Test IAMService", () => {
    const broker = new moleculer_1.ServiceBroker();
    const serviceSchema = iam_1.IAMServiceSchema(new provider_1.OIDCProvider({ issuer: "http://localhost:8888" }));
});
;
beforeAll(() => broker.start());
afterAll(() => broker.stop());
it("should be created", () => {
    expect(broker.createService(serviceSchema)).toBeDefined();
});
it("should throw for iam.client.create without detailed params", () => {
    return expect(broker.call("iam.client.create", { client_id: "test" })).rejects.toThrow();
});
;
//# sourceMappingURL=iam.spec.js.map
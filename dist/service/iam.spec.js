"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moleculer_1 = require("moleculer");
const iam_1 = require("./iam");
describe("Test IAMService", () => {
    const broker = new moleculer_1.ServiceBroker();
    const service = broker.createService(iam_1.IAMService);
    beforeAll(() => broker.start());
    afterAll(() => broker.stop());
    it("should be created", () => {
        expect(service).toBeDefined();
    });
    it("should return with 'Hello Anonymous'", () => {
        return broker.call("iam.oidc.test")
            .then((res) => {
            expect(res).toBe("Hello Anonymous");
        });
    });
    it("should return with 'Hello John'", () => {
        return broker.call("iam.oidc.test", { name: "John" })
            .then((res) => {
            expect(res).toBe("Hello John");
        });
    });
});
//# sourceMappingURL=iam.spec.js.map
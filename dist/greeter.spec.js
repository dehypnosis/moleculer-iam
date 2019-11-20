"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const moleculer_1 = require("moleculer");
const GreeterService = __importStar(require("./greeter.service"));
describe("Test GreeterService", () => {
    const broker = new moleculer_1.ServiceBroker();
    const service = broker.createService(GreeterService);
    beforeAll(() => broker.start());
    afterAll(() => broker.stop());
    it("should be created", () => {
        expect(service).toBeDefined();
    });
    it("should return with 'Hello Anonymous'", () => {
        return broker.call("auth.test")
            .then((res) => {
            expect(res).toBe("Hello Anonymous");
        });
    });
    it("should return with 'Hello John'", () => {
        return broker.call("auth.test", { name: "John" })
            .then((res) => {
            expect(res).toBe("Hello John");
        });
    });
});
//# sourceMappingURL=greeter.spec.js.map
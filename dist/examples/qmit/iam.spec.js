"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const iam_1 = require("./iam");
describe("Test 'IAM'", () => {
    afterAll(() => iam_1.broker.stop());
    describe("Simple working test", () => {
        it("started well", () => {
            return expect(iam_1.broker.start()).resolves.not.toThrow();
        });
    });
});
//# sourceMappingURL=iam.spec.js.map
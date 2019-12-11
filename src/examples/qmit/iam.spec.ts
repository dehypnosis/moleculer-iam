import { broker } from "./iam";

describe("Test 'IAM'", () => {
  afterAll(() => broker.stop());

  describe("Simple working test", () => {
    it("started well", () => {
      return expect(broker.start()).resolves.not.toThrow();
    });
  });
});

import { broker } from "./iam";

jest.setTimeout(1000 * 30);

describe("Test 'IAM'", () => {
  afterAll(() => broker.stop());

  describe("Simple working test", () => {
    it("started well", () => {
      return expect(broker.start()).resolves.not.toThrow();
    });
  });
});

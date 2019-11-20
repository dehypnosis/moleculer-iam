"use strict";

import { ServiceBroker } from "moleculer";
import { IdentityProviderService } from "./iam.identity.service";

describe("Test OIDCService", () => {
  const broker = new ServiceBroker();
  const service = broker.createService(IdentityProviderService);

  beforeAll(() => broker.start());
  afterAll(() => broker.stop());

  it("should be created", () => {
    expect(service).toBeDefined();
  });

  it("should return with 'Hello Anonymous'", () => {
    return broker.call("iam.identity.test")
      .then((res) => {
        expect(res).toBe("Hello Anonymous");
      });
  });

  it("should return with 'Hello John'", () => {
    return broker.call("iam.identity.test", {name: "John"})
      .then((res) => {
        expect(res).toBe("Hello John");
      });
  });
});

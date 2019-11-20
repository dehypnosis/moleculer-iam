"use strict";

import { ServiceBroker } from "moleculer";
import { OIDCProviderService } from "./iam.oidc.service";

describe("Test OIDCProviderService", () => {
  const broker = new ServiceBroker();
  const service = broker.createService(OIDCProviderService);

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
    return broker.call("iam.oidc.test", {name: "John"})
      .then((res) => {
        expect(res).toBe("Hello John");
      });
  });
});

"use strict";

import { ServiceBroker } from "moleculer";
import * as GreeterService from "./greeter.service";

describe("Test GreeterService", () => {
  const broker = new ServiceBroker();
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
    return broker.call("auth.test", {name: "John"})
      .then((res) => {
        expect(res).toBe("Hello John");
      });
  });
});

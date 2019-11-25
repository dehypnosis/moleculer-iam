"use strict";

import { ServiceBroker } from "moleculer";
import { createIAMServiceSchema } from "./iam";

describe("Test IAMService", () => {
  const broker = new ServiceBroker();
  const serviceSchema = createIAMServiceSchema({
    issuer: "http://localhost:8888",
    http: {
      hostname: "localhost",
      port: 8888,
    },
  });

  beforeAll(() => broker.start());
  afterAll(() => broker.stop());

  it("should be created", () => {
    expect(broker.createService(serviceSchema)).toBeDefined();
  });

  it("should throw for iam.client.create without detailed params", () => {
    return expect(broker.call("iam.client.create", { client_id: "test" })).rejects.toThrow();
  });
});

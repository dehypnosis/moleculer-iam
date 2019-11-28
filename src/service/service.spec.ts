"use strict";

import { ServiceBroker } from "moleculer";
import { IAMServiceSchema } from "./service";

describe("Test IAMService", () => {
  const broker = new ServiceBroker();
  const serviceSchema = IAMServiceSchema({
    identity: {},
    oidc: { issuer: "http://localhost:8888" },
    server: {
      http: {
        hostname: "localhost",
        port: 8888,
      },
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

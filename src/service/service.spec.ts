"use strict";

import { ServiceBroker } from "moleculer";
import { IAMServiceSchema } from "./service";
import { OIDCProvider } from "../oidc";
import { Op } from "../helper/rdbms";

const env = (name: string, fallback: any) => {
  const value = process.env[name];
  return typeof value === "undefined" ? fallback : value;
};

const broker = new ServiceBroker({ logLevel: "error" });
broker.createService(
  IAMServiceSchema({
    idp: {},
    oidc: {
      issuer: "http://localhost:8888",
      adapter: {
        type: "RDBMS",
        options: {
          dialect: env("TEST_RDBMS_DIALECT", "mysql"),
          host: env("TEST_RDBMS_HOST", "mysql-dev.internal.qmit.pro"),
          database: env("TEST_RDBMS_DATABASE", "iam"),
          username: env("TEST_RDBMS_USERNAME", "iam"),
          password: env("TEST_RDBMS_PASSWORD", "iam"),
          sqlLogLevel: env("TEST_RDBMS_LOG_LEVEL", "none"),
        },
      },
    },
    server: {
      http: {
        hostname: "localhost",
        port: 8888,
      },
    },
  }),
);

beforeAll(() => broker.start());
afterAll(() => broker.stop());

describe("iam.client.*", () => {
  it("iam.client.get", () => {
    return expect(broker.call("iam.client.get")).resolves.toEqual(
      expect.objectContaining({
        entries: expect.arrayContaining([expect.objectContaining({ application_type: "web" })]),
        total: expect.any(Number),
      }),
    );
  });

  it("iam.client.count", () => {
    return expect(broker.call("iam.client.count")).resolves.toBeGreaterThan(0);
  });

  it("iam.client.create/find/update/delete", async () => {
    const params = { client_id: "test-service-spec", client_name: "Test service spec", redirect_uris: ["https://test-service-spec.dummy.site.com/callback"] };
    await expect(broker.call("iam.client.create", params)).resolves.not.toThrow();
    await expect(broker.call("iam.client.find", { client_id: params.client_id })).resolves.toEqual(expect.objectContaining(params));
    await expect(broker.call("iam.client.update", { client_id: params.client_id, client_name: "updated" })).resolves.toEqual(expect.objectContaining({ ...params, client_name: "updated"}));
    await expect(broker.call("iam.client.delete", { client_id: params.client_id })).resolves.not.toThrow();
    await expect(broker.call("iam.client.find", { client_id: params.client_id })).rejects.toThrow();
  });
});

describe("iam.model.*", () => {
  for (const kind of OIDCProvider.volatileModelNames) {
    it(`iam.model.get/count/delete for ${kind}`, async () => {
      const where = { exp: {[Op.gte]: Math.floor(new Date().getTime()/1000)}};
      const entries = await broker.call(
        "iam.model.get",
        { kind, where },
      );

      if (entries.total > 0) {
        expect(entries).toEqual(
          expect.objectContaining({
            entries: expect.arrayContaining([expect.objectContaining({ jti: expect.any(String), kind })]),
            total: expect.any(Number),
          }),
        );
        await expect(broker.call(
          "iam.model.count",
          { kind, where },
        )).resolves.toBeGreaterThan(0);
        await expect(broker.call(
          "iam.model.delete",
          { kind, where },
        )).resolves.toBeGreaterThan(0);
      } else {
        expect(entries).toEqual(
          expect.objectContaining({
            entries: expect.arrayContaining([]),
            total: 0,
          }),
        );
        await expect(broker.call(
          "iam.model.count",
          { kind, where },
        )).resolves.toBe(0);
        await expect(broker.call(
          "iam.model.delete",
          { kind, where },
        )).resolves.toBe(0);
      }
    });
  }
});

describe("iam.schema.*", () => {
  it("iam.schema.get", () => {
    return expect(broker.call("iam.schema.get")).resolves.toEqual(
      expect.objectContaining({
        entries: expect.arrayContaining([expect.objectContaining({ application_type: "web" })]),
        total: expect.any(Number),
      }),
    );
  });
  // TODO: ...
});

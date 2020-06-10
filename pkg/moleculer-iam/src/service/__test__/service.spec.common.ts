"use strict";

import { v4 as uuid } from "uuid";
import { ServiceBroker, Service } from "moleculer";
import { IdentityProvider } from "../../idp";
import { OIDCProvider } from "../../op";

export function doCommonServiceTest(broker: ServiceBroker, service: Service) {

  beforeAll(async () => {
    await broker.start();
    await broker.waitForServices("iam");
  });
  afterAll(() => broker.stop());

  describe("iam.client.*", () => {
    it("iam.client.get", () => {
      return expect(broker.call("iam.client.get")).resolves.toEqual(
        expect.objectContaining({
          entries: expect.any(Array),
          total: expect.any(Number),
        }),
      );
    });

    it("iam.client.count", () => {
      return expect(broker.call("iam.client.count")).resolves.toEqual(expect.any(Number));
    });

    it("iam.client.create/find/update/delete", async () => {
      const params = {client_id: "test-service-spec", client_name: "Test service spec", redirect_uris: ["https://test-service-spec.dummy.site.com/callback"]};
      await broker.call("iam.client.delete", {id: params.client_id}).then(undefined, () => {
      });
      await expect(broker.call("iam.client.create", params)).resolves.not.toThrow();
      await expect(broker.call("iam.client.find", {id: params.client_id})).resolves.toEqual(expect.objectContaining(params));
      await expect(broker.call("iam.client.update", {...params, client_name: "updated"})).resolves.toEqual(expect.objectContaining({...params, client_name: "updated"}));
      await expect(broker.call("iam.client.delete", {id: params.client_id})).resolves.not.toThrow();
      await new Promise(resolve => setTimeout(resolve, 1000));
      await expect(broker.call("iam.client.find", {id: params.client_id})).resolves.toBeFalsy();
    });
  });

  describe("iam.model.*", () => {
    for (const kind of OIDCProvider.volatileModelNames) {
      it(`iam.model.get/count/delete for ${kind}`, async () => {
        const where = {exp: {$neq: null, $and: {$lt: Math.floor(new Date().getTime() / 1000)}}};
        const entries: any = await broker.call(
          "iam.model.get",
          {kind, where},
        );

        if (entries.total > 0) {
          expect(entries).toEqual(
            expect.objectContaining({
              entries: expect.arrayContaining([expect.objectContaining({jti: expect.any(String), kind})]),
              total: expect.any(Number),
            }),
          );
          await expect(broker.call(
            "iam.model.count",
            {kind, where},
          )).resolves.toBeGreaterThan(0);
          await expect(broker.call(
            "iam.model.delete",
            {kind, where},
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
            {kind, where},
          )).resolves.toBe(0);
          await expect(broker.call(
            "iam.model.delete",
            {kind, where},
          )).resolves.toBe(0);
        }
      });
    }
  });

  describe("iam.schema.*", () => {
    it("iam.schema.get/find", async () => {
      await expect(broker.call("iam.schema.get").then(undefined, console.error)).resolves.toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            scope: expect.any(String),
            key: expect.any(String),
            active: expect.any(Boolean),
            validation: expect.anything(),
            migration: expect.any(String),
            version: expect.any(String),
          }),
        ]),
      );

      await expect(broker.call("iam.schema.get", {scope: ["profile"], active: true})).resolves.toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            scope: "profile",
            key: expect.any(String),
            active: true,
            validation: expect.anything(),
            migration: expect.any(String),
            version: expect.any(String),
          }),
        ]),
      );

      await expect(broker.call("iam.schema.find", {key: "email", active: true})).resolves.toEqual(
        expect.objectContaining({
          scope: "email",
          key: "email",
          active: true,
          validation: expect.anything(),
          migration: expect.any(String),
          version: expect.any(String),
        }),
      );
    });

    it("iam.schema.define", async () => {
      await expect(broker.call("iam.schema.define", {key: "test-will-throw"})).rejects.toThrow(expect.objectContaining({code: 422}));

      await expect(broker.call("iam.schema.define", {
        key: "useless_claim",
        scope: "_test",
        validation: "string",
      })).resolves.toEqual(
        expect.objectContaining({
          key: "useless_claim",
          scope: "_test",
          validation: "string",
          active: true,
          version: expect.any(String),
          migration: expect.any(String),
        }),
      );
    });
  });

  describe("iam.identity.*", () => {
    it("iam.identity.validate/validateCredentials", async () => {
      // validate payload in pre-flight
      await expect(broker.call("iam.identity.validate", {scope: "email"})).rejects.toEqual(
        expect.objectContaining({
          code: 422,
          data: expect.arrayContaining([
            expect.objectContaining({field: "claims.email"}),
          ]),
        }),
      );

      // can validate credentials together
      await expect(broker.call("iam.identity.validate", {scope: "email", credentials: {password: "123"}})).rejects.toEqual(
        expect.objectContaining({
          code: 422,
          data: expect.arrayContaining([
            expect.objectContaining({field: "claims.email"}),
            expect.objectContaining({field: "credentials.password"}),
          ]),
        }),
      );

      // can just validate credentials
      await expect(broker.call("iam.identity.validateCredentials", {password: "123"})).rejects.toEqual(
        expect.objectContaining({
          code: 422,
          data: expect.arrayContaining([
            expect.objectContaining({field: "password"}),
          ]),
        }),
      );
    });

    it("iam.identity.create/update/delete/restore and find", async () => {
      // invalid payload
      await expect(broker.call("iam.identity.create", {})).rejects.toEqual(
        expect.objectContaining({
          code: 422,
          data: expect.arrayContaining([
            expect.objectContaining({field: "claims.email"}),
            expect.objectContaining({field: "claims.name"}),
          ]),
        }),
      );

      // valid payload
      const email = `${uuid().substr(0, 16)}@test-iam-service.com`;
      let identity: any;
      await expect(
        broker.call("iam.identity.create", {
          scope: "email openid profile",
          claims: {
            email,
            name: "Service Tester",
          },
          credentials: {
            password: "12341234",
          },
        })
          .then(res => (identity = res)),
      ).resolves.toEqual(
        expect.objectContaining({
          claims: expect.objectContaining({email}),
        }),
      );

      // update
      await expect(
        broker.call("iam.identity.update", {
          id: identity.id,
          scope: "profile",
          claims: {name: "updated"},
          metadata: {whatever: "nothing"},
        }),
      ).resolves.toEqual(
        expect.objectContaining({
          id: identity.id,
          claims: expect.objectContaining({name: "updated"}),
          metadata: expect.objectContaining({whatever: "nothing"}),
        }),
      );

      // delete (soft)
      await expect(
        broker.call("iam.identity.delete", {
          id: identity.id,
          permanently: false,
        }),
      ).resolves.toEqual(identity.id);

      // check soft delete
      await expect(
        broker.call("iam.identity.find", {
          id: identity.id,
          metadata: {
            softDeleted: false,
          },
        }),
      ).resolves.toBeFalsy();

      await expect(
        broker.call("iam.identity.find", {
          where: {
            id: identity.id,
            metadata: {
              softDeleted: true,
            },
          },
        }),
      ).resolves.toBeTruthy();

      // restore
      await expect(
        broker.call("iam.identity.restore", {
          id: identity.id,
        }),
      ).resolves.toEqual(identity.id);

      // check restored
      await expect(
        broker.call("iam.identity.find", {
          id: identity.id,
        }),
      ).resolves.toBeTruthy();

      // delete (hard)
      await expect(
        broker.call("iam.identity.delete", {
          id: identity.id,
          permanently: true,
        }),
      ).rejects.toThrow(); // requires soft delete first

      await expect(
        broker.call("iam.identity.delete", {
          id: identity.id,
          permanently: false,
        }),
      ).resolves.toEqual(identity.id);

      await expect(
        broker.call("iam.identity.delete", {
          id: identity.id,
          permanently: true,
        }),
      ).resolves.toEqual(identity.id);

      // check hard deleted
      await expect(
        broker.call("iam.identity.find", {
          where: {
            id: identity.id,
            metadata: {
              softDeleted: true,
            },
          },
        }),
      ).resolves.toBeFalsy();
    });

    it("iam.identity.get/count", async () => {
      const where: any = {
        claims: {
          email: {$like: "%@%"},
        },
      };
      let result: any;
      await expect(
        broker.call("iam.identity.get", {
          where,
          limit: 5,
        })
          .then(res => result = res),
      ).resolves.not.toThrow();

      expect(result).toEqual(
        expect.objectContaining({
          entries: expect.arrayContaining(result && result.total > 0 ? [
            expect.objectContaining({
              id: expect.any(String),
              claims: expect.anything(),
              metadata: expect.anything(),
            }),
          ] : []),
          total: expect.any(Number),
        }),
      );

      await expect(broker.call("iam.identity.count", {where})).resolves.toBe(result.total);
    });

    // used to force refresh identity cache from external changes
    it("iam.identity.refresh", async () => {
      const idp = service.idp as IdentityProvider;
      const originalRefresher = idp.adapter.onClaimsUpdated;
      const mockedRefresher = jest.fn();
      idp.adapter.onClaimsUpdated = mockedRefresher as any;

      const email = `${uuid().substr(0, 16)}@test-iam-service.com`;
      let identity: any;
      await expect(
        idp.create({
          scope: "email openid profile",
          claims: {
            email,
            name: "Service Tester2",
          },
          credentials: {
            password: "12341234",
          },
          metadata: {},
        }).then(id => id.json()).then(i => identity = i),
      ).resolves.toEqual(expect.objectContaining({claims: expect.objectContaining({email})}));
      expect(mockedRefresher).toHaveBeenCalledWith(identity.id, expect.anything(), expect.anything());

      // not all adapter requires/implements refreshing and cache mechanism
      // await expect(broker.call("iam.identity.find", {email})).resolves.toBeFalsy();

      idp.adapter.onClaimsUpdated = originalRefresher;
      mockedRefresher.mockClear();
      await expect(broker.call("iam.identity.refresh", {id: identity.id})).resolves.not.toThrow();
      expect(mockedRefresher).not.toBeCalled();

      await expect(broker.call("iam.identity.find", {email})).resolves.toBeTruthy();
    });
  });
}

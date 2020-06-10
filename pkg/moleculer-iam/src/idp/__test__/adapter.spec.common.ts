"use strict";

import { IdentityProvider } from "../idp";
import { Identity } from "../identity";
import { OIDCAccountClaims } from "../../op";
import { IdentityClaimsSchema } from "../claims";
import { v4 as uuid  } from "uuid";

export function doCommonAdapterTest(idp: IdentityProvider) {
  const testEmail = `${uuid()}@tEsT.com`;
  const testSchemaKeys = ["testnote", "testcomplex", "testscore"];

  let identity: Identity;
  beforeAll(async () => {
    await idp.start();
    await idp.claims.forceDeleteClaimsSchemata(...testSchemaKeys).catch(err => { });

    identity = await idp.create({
      metadata: {federation: {}, softDeleted: false},
      scope: ["openid", "profile", "email", "phone"],
      claims: {email: testEmail, name: "Tester", phone_number: "KR|010-7777-7777"},
      credentials: {password: "12341234"},
    });
  });

  describe("CRUD identity", () => {
    it("identity should be created well with valid payload", () => {
      return expect(identity.claims()).resolves.not.toThrow();
    });

    it("identity should not be created with duplicate sub, email, phone", () => {
      return expect(idp.create({
        metadata: {},
        scope: ["openid", "profile", "email", "phone"],
        claims: {sub: identity.id, email: testEmail, name: "Tester", phone_number: "KR|010-7777-7777"},
        credentials: {password: "12341234"},
      })).rejects.toEqual(
        expect.objectContaining({
          status: 422,
          data: expect.arrayContaining([
            expect.objectContaining({field: "claims.sub", type: "duplicate"}),
            expect.objectContaining({field: "claims.email", type: "duplicate"}),
            expect.objectContaining({field: "claims.phone_number", type: "duplicate"}),
          ]),
        }),
      );
    });

    it("identity should have metadata", async () => {
      await expect(identity.metadata()).resolves
        .toEqual(expect.objectContaining({softDeleted: false}));
    });

    it("identity should have claims including base claims", async () => {
      await expect(identity.claims()).resolves
        .toEqual(expect.objectContaining({
          email_verified: false,
          email: testEmail.toLowerCase(), // should be normalized
          phone_number: "+82 10-7777-7777", // should be sanitized
          name: "Tester",
          phone_number_verified: false,
          picture: null,
        }));
    });

    it("identity could update own claims with validation", async () => {
      await expect(identity.updateClaims({
        email_verified: true,
        phone_number_verified: true,
      }, ["phone", "email"])).resolves.not.toThrow();

      await expect(identity.claims("userinfo", "email phone")).resolves
        .toEqual(expect.objectContaining({
          email_verified: true,
          phone_number_verified: true,
        }));
    });

    it("identity could not update immutable claims", async () => {
      await expect(identity.updateClaims({
        sub: "abcdefg",
      }, "openid")).rejects.toBeTruthy();

      await expect(identity.updateClaims({
        email: `updating-${testEmail}`,
      }, "email")).rejects.toBeTruthy();
    });

    it("identity could assert and update own credentials", async () => {
      await expect(identity.assertCredentials({password: "12341234"})).resolves.toBeTruthy();
      await expect(identity.assertCredentials({password: "23452345"})).resolves.toBeFalsy();
      await expect(identity.updateCredentials({password: "23452345"})).resolves.toBeTruthy();
      await expect(identity.updateCredentials({password: "23452345"})).resolves.toBeFalsy();
      await expect(identity.assertCredentials({password: "23452345"})).resolves.toBeTruthy();
      await expect(identity.updateCredentials({password: "12341234"})).resolves.toBeTruthy();
    });

    it("identity could be soft deleted and restored", async () => {
      await expect(identity.isSoftDeleted()).resolves.not.toBeTruthy();
      await expect(identity.delete(false)).resolves.not.toThrow();
      await expect(identity.isSoftDeleted()).resolves.toBeTruthy();
      await expect(identity.restoreSoftDeleted()).resolves.not.toThrow();
      await expect(identity.isSoftDeleted()).resolves.not.toBeTruthy();
    });

    it("identity could read and update metadata", async () => {
      await expect(identity.updateMetadata({test: 12345})).resolves.not.toThrow();
      await expect(identity.metadata()).resolves.toEqual(expect.objectContaining({test: 12345}));
    });

    it("identity could be fetched by id, email, phone_number", async () => {
      await expect(idp.findOrFail({id: identity.id}).then(id => id.claims())).resolves.toEqual(expect.objectContaining({sub: identity.id}));
      await expect(idp.findOrFail({claims: {sub: identity.id}}).then(id => id.claims())).resolves.toEqual(expect.objectContaining({sub: identity.id}));
      await expect(idp.findOrFail({claims: {phone_number: "KR|010 7777 7777"}}).then(id => id.claims())).resolves.toEqual(expect.objectContaining({phone_number: "+82 10-7777-7777"}));
      await expect(idp.findOrFail({claims: {email: testEmail}}).then(id => id.claims())).resolves.toEqual(expect.objectContaining({email: testEmail.toLowerCase()}));
    });

    it("identities could be fetched", async () => {
      await expect(
        idp.get({
          where: {
            claims: {
              sub: identity.id,
              email: testEmail.toLowerCase(),
            },
          },
        })
          .then(identities => Promise.all(identities.map(idn => idn.claims()))),
      )
        .resolves.toEqual(expect.arrayContaining([expect.objectContaining({sub: identity.id})]));
      await expect(idp.count()).resolves.toBeGreaterThan(0);
    });

    it("can fetch claims and metadata at once", async () => {
      const claims = await identity.claims("userinfo", "profile");
      const metadata = await identity.metadata();
      await expect(identity.json("profile")).resolves.toEqual(expect.objectContaining({
        id: identity.id,
        claims,
        metadata,
      }));

      await expect(identity.update("profile", {
        name: "whatever",
      }, {
        blabla: true,
      }, {
        password: "12345678",
      })).resolves.not.toThrow();

      await expect(identity.json()).resolves.toEqual(expect.objectContaining({
        id: identity.id,
        claims: expect.objectContaining({name: "whatever"}),
        metadata: expect.objectContaining({blabla: true}),
      }));

      await expect(identity.assertCredentials({password: "12345678"})).resolves.toBeTruthy();
    });
  });

  describe("Dynamic scope and claims migration", () => {
    it("can add new claims with migration", async () => {
      await expect(idp.claims.defineClaimsSchema({
        scope: "profile",
        key: "testnote",
        validation: {
          type: "string",
          optional: true,
        },
      })).resolves.not.toThrow();

      await expect(identity.claims("userinfo", "profile")).resolves.toEqual(expect.objectContaining({testnote: null}));

      await expect(idp.claims.defineClaimsSchema({
        scope: "testwhatever",
        key: "testnote",
        validation: {
          type: "string",
          optional: true,
        },
      })).resolves.not.toThrow();

      // scope moved...
      await expect(identity.claims("userinfo", "profile")).resolves.toEqual(expect.not.objectContaining({testnote: null}));
      await expect(identity.claims("userinfo", "testwhatever")).resolves.toEqual(expect.objectContaining({testnote: null}));

      // again with default vaule
      await expect(idp.claims.defineClaimsSchema({
        scope: "profile",
        key: "testnote",
        validation: {
          type: "string",
          default: "testnote-default-value",
        },
      })).resolves.not.toThrow();
      await expect(identity.claims("userinfo", "profile")).resolves.toEqual(expect.objectContaining({testnote: "testnote-default-value"}));
    });

    it("can add new claims with custom migration function", async () => {
      await expect(idp.claims.defineClaimsSchema({
        scope: "profile",
        key: "testscore",
        validation: {
          type: "number",
          default: 0,
        },
      })).resolves.not.toThrow();

      await expect(idp.claims.defineClaimsSchema({
        scope: "profile",
        key: "testscore",
        validation: {
          type: "number",
          positive: true,
          default: 1,
        },
        migration: (/* istanbul ignore next */ (old: any, claims: OIDCAccountClaims) => {
          return claims.email && claims.email.length || 1;
        }).toString(),
      })).resolves.not.toThrow();

      await expect(identity.claims("userinfo", "profile")).resolves.toEqual(expect.objectContaining({testscore: testEmail.length}));
    });
  });

  describe("Complex claims definition and remove claims by scopes", () => {
    it("can create object claims and migrate and revert", async () => {
      const testcomplex = {
        number: 1234,
        string: "test",
        strings: ["1", "2", "3", "4"],
      };
      let initialSchema: IdentityClaimsSchema;
      await expect(idp.claims.defineClaimsSchema({
        scope: "testcomplex",
        key: "testcomplex",
        validation: {
          type: "object",
          strict: false,
          props: {
            number: "number",
            string: "string",
            strings: {
              type: "array",
              items: "string",
              empty: false,
            },
          },
          default: testcomplex,
        },
      }).then(schema => {
        initialSchema = schema;
        return schema;
      })).resolves.not.toThrow();

      await expect(identity.updateClaims({testcomplex}, "testcomplex")).resolves.not.toThrow();

      await expect(identity.claims("userinfo", "testcomplex")).resolves.toEqual(expect.objectContaining({
        testcomplex,
      }));
      await expect(identity.metadata()).resolves.toEqual(expect.objectContaining({
        scope: expect.objectContaining({
          testcomplex: true,
        }),
      }));

      // now change strings as numbers
      await expect(idp.claims.defineClaimsSchema({
        scope: "testcomplex",
        key: "testcomplex",
        validation: {
          type: "object",
          strict: false,
          props: {
            number: "number",
            string: "string",
            numbers: {
              type: "array",
              items: "number",
              empty: false,
            },
          },
        },
        migration: `(old, claims) => {
        const obj = old || ${JSON.stringify(testcomplex)};
        return {
          ...obj,
          numbers: obj.strings.map(s => parseInt(s)),
        };
      }`,
      })).resolves.not.toThrow();

      await expect(identity.claims("userinfo", "testcomplex")).resolves.toEqual(expect.objectContaining({
        testcomplex: {
          ...testcomplex,
          numbers: [1, 2, 3, 4],
        },
      }));

      // revert to old version
      await expect(idp.claims.defineClaimsSchema({
        scope: "testcomplex",
        key: "testcomplex",
        validation: {
          type: "object",
          strict: false,
          props: {
            number: "number",
            string: "string",
            strings: {
              type: "array",
              items: "string",
              empty: false,
            },
          },
          default: testcomplex,
        },
        parentVersion: initialSchema!.version,
        migration: `(old, claims) => {
          return old || ${JSON.stringify(testcomplex)};
        }`,
      })).resolves.not.toThrow();

      await expect(identity.claims("userinfo", "testcomplex")).resolves.toEqual(expect.objectContaining({
        testcomplex,
      }));

      // delete claims by scope
      await expect(identity.deleteClaims("testcomplex")).resolves.not.toThrow();
      await expect(identity.claims("userinfo", "testcomplex")).resolves.toEqual(expect.objectContaining({
        testcomplex: null,
      }));
      await expect(identity.metadata()).resolves.toEqual(expect.objectContaining({
        scope: expect.objectContaining({
          testcomplex: false,
        }),
      }));
    });
  });

  describe("Permanently delete user", () => {
    it("can delete user and then user will not be found", async () => {
      const removal = await idp.create({
        metadata: {federation: {}, softDeleted: false},
        scope: [], // mandatory scopes will put "openid", "profile", "email", ...
        claims: {name: "Test", email: "aa" + testEmail, testnote: "xasdasd"},
        credentials: {password: "12341234"},
      });
      await expect(removal.delete(true)).resolves.not.toThrow();
      await expect(idp.findOrFail({id: removal.id})).rejects.toBeTruthy();
    });
  });

  afterAll(async () => {
    if (identity) {
      await identity.delete(true);
    }
    await idp.claims.forceDeleteClaimsSchemata(...testSchemaKeys).catch(err => console.error(err));
    await idp.stop();
  });
}

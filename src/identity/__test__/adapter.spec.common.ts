"use strict";

import { IdentityProvider } from "../provider";
import { Identity } from "../identity";
import uuid from "uuid";
import { OIDCAccountClaims } from "../../oidc";
import { IdentityClaimsSchema } from "../claims";

export function doCommonAdapterTest(idp: IdentityProvider) {
  const testEmail = `${uuid.v4()}@tEsT.com`;
  const testSchemaKeys = ["testnote", "testcomplex", "testscore"];

  let identity: Identity;
  beforeAll(async () => {
    await idp.start();
    await idp.claims.forceDeleteClaimsSchemata(...testSchemaKeys).catch(err => {});

    try {
      identity = await idp.create({
        metadata: {federation: {}, softDeleted: false},
        scope: ["openid", "profile", "email", "phone"],
        claims: {sub: uuid(), email: testEmail, name: "Tester", phone_number: "010-4477-1234"},
        credentials: {password: "1234"},
      });
      console.log(await identity.claims(), await identity.metadata());
    } catch (error) {
      console.error(error);
    }
  });

  describe("CRUD identity", () => {
    it("identity should be created well with valid payload", () => {
      expect(identity).toBeDefined();
    });

    it("identity cannot be created without sub (openid scope)", async () => {
      await expect(idp.create({
        metadata: {},
        scope: ["openid", "profile", "email", "phone"],
        claims: {sub: identity.id, email: testEmail, name: "Tester", phone_number: "010-4477-1234"},
        credentials: {password: "1234"},
      })).rejects.toThrow();
    });

    it("identity cannot be created with same sub", async () => {
      await expect(idp.create({
        metadata: {federation: {}, softDeleted: false},
        // @ts-ignore
        claims: {
          name: "what",
        },
        scope: ["profile"],
        credentials: {},
      })).rejects.toThrow();
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
          phone_number: "+82 10-4477-1234", // should be sanitized
          name: "Tester",
          phone_number_verified: false,
          picture: null,
        }));
    });

    it("identity could update own claims with validation", async () => {
      await expect(identity.updateClaims({
        email_verified: true,
        phone_number_verified: true,
      })).resolves.not.toThrow();

      await expect(identity.claims("userinfo", "email phone")).resolves
        .toEqual(expect.objectContaining({
          email_verified: true,
          phone_number_verified: true,
        }));

      await expect(identity.updateClaims({
        sub: "abcdefg", // should not update sub claims after being created once
      })).rejects.toThrow();
    });

    it("identity could assert and update own credentials", async () => {
      await expect(identity.assertCredentials({password: "1234"})).resolves.toBeTruthy();
      await expect(identity.assertCredentials({password: "2345"})).resolves.toBeFalsy();
      await expect(identity.updateCredentials({password: "2345"})).resolves.toBeTruthy();
      await expect(identity.updateCredentials({password: "2345"})).resolves.toBeFalsy();
      await expect(identity.assertCredentials({password: "2345"})).resolves.toBeTruthy();
      await expect(identity.updateCredentials({password: "1234"})).resolves.toBeTruthy();
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
      await expect(idp.find({id: identity.id}).then(id => id.claims())).resolves.toEqual(expect.objectContaining({sub: identity.id}));
      await expect(idp.find({claims: {sub: identity.id}}).then(id => id.claims())).resolves.toEqual(expect.objectContaining({sub: identity.id}));
      await expect(idp.find({claims: {phone_number: "010 4477 1234"}}).then(id => id.claims())).resolves.toEqual(expect.objectContaining({phone_number: "+82 10-4477-1234"}));
      await expect(idp.find({claims: {email: testEmail}}).then(id => id.claims())).resolves.toEqual(expect.objectContaining({email: testEmail.toLowerCase()}));
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
          optional: false,
        },
        seed: "testnote-default-value",
      })).resolves.not.toThrow();
      await expect(identity.claims("userinfo", "profile")).resolves.toEqual(expect.objectContaining({testnote: "testnote-default-value"}));
    });

    it("can add new claims with cutom migration function", async () => {
      await expect(idp.claims.defineClaimsSchema({
        scope: "profile",
        key: "testscore",
        validation: {
          type: "number",
        },
        seed: 0,
      })).resolves.not.toThrow();

      await expect(idp.claims.defineClaimsSchema({
        scope: "profile",
        key: "testscore",
        validation: {
          type: "number",
          positive: true,
          default: 100, // default for create/update
        },
        seed: 1, // default for migration
        migration: ((old: any, def: any, claims: OIDCAccountClaims) => {
          return claims.email!.length;
        }).toString(),
      })).resolves.not.toThrow();

      await expect(identity.claims("userinfo", "profile")).resolves.toEqual(expect.objectContaining({testscore: testEmail.length}));
    });
  });

  describe("Complex claims definition", () => {
    it("can create object claims and migrate and revert", async () => {
      const seed = {
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
        },
        seed,
      }).then(schema => {
        initialSchema = schema;
        return schema;
      })).resolves.not.toThrow();

      await expect(identity.claims("testcomplex")).resolves.toEqual(expect.objectContaining({
        testcomplex: seed,
      }));

      // now change strings as numbers
      const seed2 = {
        number: 5678,
        string: "test2",
        numbers: [5, 6, 7, 8],
      };
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
        seed: seed2,
        migration: `(old, seed, claims) => {
        return old ? {
          ...old,
          numbers: old.strings.map(s => parseInt(s)),
        } : seed;
      }`,
      }).catch(err => console.error(err.fields))).resolves.not.toThrow();

      await expect(identity.claims("testcomplex")).resolves.toEqual(expect.objectContaining({
        testcomplex: {
          ...seed,
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
        },
        seed,
        parentVersion: initialSchema!.version,
        migration: `
        (old, seed, claims) => {
          return old ? old : seed;
        }
      `,
      })).resolves.not.toThrow();

      await expect(identity.claims("testcomplex")).resolves.toEqual(expect.objectContaining({
        testcomplex: seed,
      }));
    });
  });

  describe("Permanently delete user", () => {
    it("can delete user and then user will not be found", async () => {
      const removal = await idp.create({
        metadata: {federation: {}, softDeleted: false},
        scope: [], // mandatory scopes will put "openid", "profile", "email", ...
        claims: {sub: uuid().substr(0, 16), name: "Test", email: "aa" + testEmail, testnote: "xasdasd"},
        credentials: {password: "1234"},
      });
      await expect(removal.delete(true)).resolves.not.toThrow();
      await expect(idp.find({id: removal.id})).rejects.toThrow();
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

"use strict";

import { IdentityProvider } from "../provider";
import { Identity } from "../identity";
import uuid from "uuid";
import { OIDCAccountClaims } from "../../oidc";
import { IdentityClaimsSchema } from "../claims";

export function doCommonAdapterTest(idp: IdentityProvider) {
  const testEmail = `${uuid.v4()}@tEsT.com`;

  let identity: Identity;
  beforeAll(async () => {
    await idp.start();

    identity = await idp.create({
      metadata: {federation: {}, softDeleted: false},
      scope: ["openid", "profile", "email", "phone"],
      claims: {sub: uuid().substr(0, 16), email: testEmail, name: "Tester", phone_number: "010-4477-1234"},
      credentials: {password: "1234"},
    });
  });

  describe("CRUD identity", () => {
    it("identity should be created well with valid payload", () => {
      expect(identity).toBeDefined();
    });

    it("identity cannot be created without sub (openid scope)", async () => {
      await expect(idp.create({
        metadata: {federation: {}, softDeleted: false},
        scope: ["openid", "profile", "email", "phone"],
        claims: {sub: identity.id, email: testEmail, name: "Tester", phone_number: "010-4477-1234"},
        credentials: {password: "1234"},
      })).rejects.toThrow();
    });

    it("identity cannot be created with same sub", async () => {
      await expect(idp.create({
        metadata: {federation:{}, softDeleted:false},
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
      }).catch(err => console.error(err.error_detail))).resolves.not.toThrow();

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
      await expect(identity.updateMetadata({ test: 12345 })).resolves.not.toThrow();
      await expect(identity.metadata()).resolves.toEqual(expect.objectContaining({test: 12345}));
    });

    it("identity could be fetched by id, email, phone_number", async () => {
      await expect(idp.find({ id: identity.id })).resolves.toEqual(expect.objectContaining({ id: identity.id }));
      await expect(idp.find({ phone_number: "010 4477 1234" })).resolves.toEqual(expect.objectContaining({ id: identity.id }));
      await expect(idp.find({ email: testEmail })).resolves.toEqual(expect.objectContaining({ id: identity.id }));
    });

    it("identities could be fetched", async () => {
      await expect(idp.get()).resolves.toEqual(expect.arrayContaining([expect.objectContaining({ id: identity.id })]));
      await expect(idp.count()).resolves.toBeGreaterThan(0);
    });
  });

  describe("Dynamic scope and claims migration", () => {
    it("can add new claims with migration", async () => {
      await expect(idp.claims.defineClaimsSchema({
        scope: "profile",
        key: "note",
        validation: {
          type: "string",
          optional: true,
        },
      })).resolves.not.toThrow();

      await expect(identity.claims("userinfo", "profile")).resolves.toEqual(expect.objectContaining({ note: null }));

      await expect(idp.claims.defineClaimsSchema({
        scope: "whatever",
        key: "note",
        validation: {
          type: "string",
          optional: true,
        },
      })).resolves.not.toThrow();

      // scope moved...
      await expect(identity.claims("userinfo", "profile")).resolves.toEqual(expect.not.objectContaining({ note: null }));
      await expect(identity.claims("userinfo", "whatever")).resolves.toEqual(expect.objectContaining({ note: null }));

      // again with default vaule
      await expect(idp.claims.defineClaimsSchema({
        scope: "profile",
        key: "note",
        validation: {
          type: "string",
          optional: false,
        },
        seed: "note-default-value",
      })).resolves.not.toThrow();
      await expect(identity.claims("userinfo", "profile")).resolves.toEqual(expect.objectContaining({ note: "note-default-value" }));
    });

    it("can add new claims with cutom migration function", async () => {
      await expect(idp.claims.defineClaimsSchema({
        scope: "profile",
        key: "score",
        validation: {
          type: "number",
        },
        seed: 0,
      })).resolves.not.toThrow();

      await expect(idp.claims.defineClaimsSchema({
        scope: "profile",
        key: "score",
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

      await expect(identity.claims("userinfo", "profile")).resolves.toEqual(expect.objectContaining({ score: testEmail.length }));
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
        scope: "complex",
        key: "complex",
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

      await expect(identity.claims("complex")).resolves.toEqual(expect.objectContaining({
        complex: seed,
      }));

      // now change strings as numbers
      const seed2 = {
        number: 5678,
        string: "test2",
        numbers: [5,6,7,8],
      };
      await expect(idp.claims.defineClaimsSchema({
        scope: "complex",
        key: "complex",
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

      await expect(identity.claims("complex")).resolves.toEqual(expect.objectContaining({
        complex: {
          ...seed,
          numbers: [1,2,3,4],
        },
      }));

      // revert to old version
      await expect(idp.claims.defineClaimsSchema({
        scope: "complex",
        key: "complex",
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

      await expect(identity.claims("complex")).resolves.toEqual(expect.objectContaining({
        complex: seed,
      }));
    });
  });

  describe("Permanently delete user", () => {
    it("can delete user and then user will not be found", async () => {
      const removal = await idp.create({
        metadata: {federation: {}, softDeleted: false},
        scope: [], // mandatory scopes will put "openid", "profile", "email", "note" ...
        claims: {sub: uuid().substr(0, 16), name: "Test", email: "aa"+testEmail, note: "xasdasd"},
        credentials: {password: "1234"},
      });
      await expect(removal.delete(true)).resolves.not.toThrow();
      await expect(idp.find({ id: removal.id })).rejects.toThrow();
    });
  });

  afterAll(async () => {
    await identity.delete(true);
    await idp.stop();
  });
}

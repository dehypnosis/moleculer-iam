"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const uuid_1 = tslib_1.__importDefault(require("uuid"));
function doCommonAdapterTest(idp) {
    const testEmail = `${uuid_1.default.v4()}@tEsT.com`;
    const testSchemaKeys = ["testnote", "testcomplex", "testscore"];
    let identity;
    beforeAll(() => tslib_1.__awaiter(this, void 0, void 0, function* () {
        yield idp.start();
        yield idp.claims.forceDeleteClaimsSchemata(...testSchemaKeys).catch(err => { });
        try {
            identity = yield idp.create({
                metadata: { federation: {}, softDeleted: false },
                scope: ["openid", "profile", "email", "phone"],
                claims: { sub: uuid_1.default(), email: testEmail, name: "Tester", phone_number: "010-4477-1234" },
                credentials: { password: "12341234" },
            });
            // console.log(await identity.claims(), await identity.metadata());
        }
        catch (error) {
            console.error(error);
        }
    }));
    describe("CRUD identity", () => {
        it("identity should be created well with valid payload", () => {
            expect(identity).toBeDefined();
        });
        it("identity cannot be created without sub (openid scope)", () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield expect(idp.create({
                metadata: {},
                scope: ["openid", "profile", "email", "phone"],
                claims: { sub: identity.id, email: testEmail, name: "Tester", phone_number: "010-4477-1234" },
                credentials: { password: "12341234" },
            })).rejects.toThrow();
        }));
        it("identity cannot be created with same sub", () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield expect(idp.create({
                metadata: { federation: {}, softDeleted: false },
                // @ts-ignore
                claims: {
                    name: "what",
                },
                scope: ["profile"],
                credentials: {},
            })).rejects.toThrow();
        }));
        it("identity should have metadata", () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield expect(identity.metadata()).resolves
                .toEqual(expect.objectContaining({ softDeleted: false }));
        }));
        it("identity should have claims including base claims", () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield expect(identity.claims()).resolves
                .toEqual(expect.objectContaining({
                email_verified: false,
                email: testEmail.toLowerCase(),
                phone_number: "+82 10-4477-1234",
                name: "Tester",
                phone_number_verified: false,
                picture: null,
            }));
        }));
        it("identity could update own claims with validation", () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield expect(identity.updateClaims({
                email_verified: true,
                phone_number_verified: true,
            }, ["phone", "email"])).resolves.not.toThrow();
            yield expect(identity.claims("userinfo", "email phone")).resolves
                .toEqual(expect.objectContaining({
                email_verified: true,
                phone_number_verified: true,
            }));
            yield expect(identity.updateClaims({
                sub: "abcdefg",
            })).rejects.toThrow();
        }));
        it("identity could assert and update own credentials", () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield expect(identity.assertCredentials({ password: "12341234" })).resolves.toBeTruthy();
            yield expect(identity.assertCredentials({ password: "23452345" })).resolves.toBeFalsy();
            yield expect(identity.updateCredentials({ password: "23452345" })).resolves.toBeTruthy();
            yield expect(identity.updateCredentials({ password: "23452345" })).resolves.toBeFalsy();
            yield expect(identity.assertCredentials({ password: "23452345" })).resolves.toBeTruthy();
            yield expect(identity.updateCredentials({ password: "12341234" })).resolves.toBeTruthy();
        }));
        it("identity could be soft deleted and restored", () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield expect(identity.isSoftDeleted()).resolves.not.toBeTruthy();
            yield expect(identity.delete(false)).resolves.not.toThrow();
            yield expect(identity.isSoftDeleted()).resolves.toBeTruthy();
            yield expect(identity.restoreSoftDeleted()).resolves.not.toThrow();
            yield expect(identity.isSoftDeleted()).resolves.not.toBeTruthy();
        }));
        it("identity could read and update metadata", () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield expect(identity.updateMetadata({ test: 12345 })).resolves.not.toThrow();
            yield expect(identity.metadata()).resolves.toEqual(expect.objectContaining({ test: 12345 }));
        }));
        it("identity could be fetched by id, email, phone_number", () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield expect(idp.findOrFail({ id: identity.id }).then(id => id.claims())).resolves.toEqual(expect.objectContaining({ sub: identity.id }));
            yield expect(idp.findOrFail({ claims: { sub: identity.id } }).then(id => id.claims())).resolves.toEqual(expect.objectContaining({ sub: identity.id }));
            yield expect(idp.findOrFail({ claims: { phone_number: "010 4477 1234" } }).then(id => id.claims())).resolves.toEqual(expect.objectContaining({ phone_number: "+82 10-4477-1234" }));
            yield expect(idp.findOrFail({ claims: { email: testEmail } }).then(id => id.claims())).resolves.toEqual(expect.objectContaining({ email: testEmail.toLowerCase() }));
        }));
        it("identities could be fetched", () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield expect(idp.get({
                where: {
                    claims: {
                        sub: identity.id,
                        email: testEmail.toLowerCase(),
                    },
                },
            })
                .then(identities => Promise.all(identities.map(idn => idn.claims()))))
                .resolves.toEqual(expect.arrayContaining([expect.objectContaining({ sub: identity.id })]));
            yield expect(idp.count()).resolves.toBeGreaterThan(0);
        }));
    });
    describe("Dynamic scope and claims migration", () => {
        it("can add new claims with migration", () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield expect(idp.claims.defineClaimsSchema({
                scope: "profile",
                key: "testnote",
                validation: {
                    type: "string",
                    optional: true,
                },
            })).resolves.not.toThrow();
            yield expect(identity.claims("userinfo", "profile")).resolves.toEqual(expect.objectContaining({ testnote: null }));
            yield expect(idp.claims.defineClaimsSchema({
                scope: "testwhatever",
                key: "testnote",
                validation: {
                    type: "string",
                    optional: true,
                },
            })).resolves.not.toThrow();
            // scope moved...
            yield expect(identity.claims("userinfo", "profile")).resolves.toEqual(expect.not.objectContaining({ testnote: null }));
            yield expect(identity.claims("userinfo", "testwhatever")).resolves.toEqual(expect.objectContaining({ testnote: null }));
            // again with default vaule
            yield expect(idp.claims.defineClaimsSchema({
                scope: "profile",
                key: "testnote",
                validation: {
                    type: "string",
                    default: "testnote-default-value",
                },
            })).resolves.not.toThrow();
            yield expect(identity.claims("userinfo", "profile")).resolves.toEqual(expect.objectContaining({ testnote: "testnote-default-value" }));
        }));
        it("can add new claims with custom migration function", () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield expect(idp.claims.defineClaimsSchema({
                scope: "profile",
                key: "testscore",
                validation: {
                    type: "number",
                    default: 0,
                },
            })).resolves.not.toThrow();
            yield expect(idp.claims.defineClaimsSchema({
                scope: "profile",
                key: "testscore",
                validation: {
                    type: "number",
                    positive: true,
                    default: 1,
                },
                migration: ( /* istanbul ignore next */(old, def, claims) => {
                    console.log(claims);
                    return claims.email && claims.email.length || 0;
                }).toString(),
            })).resolves.not.toThrow();
            yield expect(identity.claims("userinfo", "profile")).resolves.toEqual(expect.objectContaining({ testscore: testEmail.length }));
        }));
    });
    describe("Complex claims definition and remove claims by scopes", () => {
        it("can create object claims and migrate and revert", () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const testcomplex = {
                number: 1234,
                string: "test",
                strings: ["1", "2", "3", "4"],
            };
            let initialSchema;
            yield expect(idp.claims.defineClaimsSchema({
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
            yield expect(identity.updateClaims({ testcomplex }, "testcomplex")).resolves.not.toThrow();
            yield expect(identity.claims("userinfo", "testcomplex")).resolves.toEqual(expect.objectContaining({
                testcomplex,
            }));
            yield expect(identity.metadata()).resolves.toEqual(expect.objectContaining({
                scope: expect.objectContaining({
                    testcomplex: true,
                }),
            }));
            // now change strings as numbers
            const testcomplex2 = {
                number: 5678,
                string: "test2",
                numbers: [5, 6, 7, 8],
            };
            yield expect(idp.claims.defineClaimsSchema({
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
                    default: testcomplex2,
                },
                migration: `(old, claims) => {
        return old ? {
          ...old,
          numbers: old.strings.map(s => parseInt(s)),
        } : ${JSON.stringify(testcomplex2)};
      }`,
            })).resolves.not.toThrow();
            yield expect(identity.claims("userinfo", "testcomplex")).resolves.toEqual(expect.objectContaining({
                testcomplex: Object.assign(Object.assign({}, testcomplex2), { numbers: [1, 2, 3, 4] }),
            }));
            // revert to old version
            yield expect(idp.claims.defineClaimsSchema({
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
                parentVersion: initialSchema.version,
                migration: `
        (old, claims) => {
          return old ? old : ${JSON.stringify(testcomplex)};
        }
      `,
            })).resolves.not.toThrow();
            yield expect(identity.claims("userinfo", "testcomplex")).resolves.toEqual(expect.objectContaining({
                testcomplex,
            }));
            // delete claims by scope
            yield expect(identity.deleteClaims("testcomplex")).resolves.not.toThrow();
            yield expect(identity.claims("userinfo", "testcomplex")).resolves.toEqual(expect.objectContaining({
                testcomplex: null,
            }));
            yield expect(identity.metadata()).resolves.toEqual(expect.objectContaining({
                scope: expect.objectContaining({
                    testcomplex: false,
                }),
            }));
        }));
    });
    describe("Permanently delete user", () => {
        it("can delete user and then user will not be found", () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const removal = yield idp.create({
                metadata: { federation: {}, softDeleted: false },
                scope: [],
                claims: { sub: uuid_1.default().substr(0, 16), name: "Test", email: "aa" + testEmail, testnote: "xasdasd" },
                credentials: { password: "12341234" },
            });
            yield expect(removal.delete(true)).resolves.not.toThrow();
            yield expect(idp.findOrFail({ id: removal.id })).rejects.toThrow();
        }));
    });
    afterAll(() => tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (identity) {
            yield identity.delete(true);
        }
        yield idp.claims.forceDeleteClaimsSchemata(...testSchemaKeys).catch(err => console.error(err));
        yield idp.stop();
    }));
}
exports.doCommonAdapterTest = doCommonAdapterTest;
//# sourceMappingURL=adapter.spec.common.js.map
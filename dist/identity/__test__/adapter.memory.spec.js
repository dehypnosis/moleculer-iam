"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const provider_1 = require("../provider");
const uuid_1 = tslib_1.__importDefault(require("uuid"));
const idp = new provider_1.IdentityProvider({
    logger: console,
}, {
    adapter: {
        type: "Memory",
        options: {},
    },
});
const testEmail = `${uuid_1.default.v4()}@tEsT.com`;
let identity;
beforeAll(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    yield idp.start();
    identity = yield idp.create({
        metadata: { federation: {}, softDeleted: false },
        scope: ["openid", "profile", "email", "phone"],
        claims: { sub: uuid_1.default().substr(0, 16), email: testEmail, name: "Tester", phone_number: "010-4477-1234" },
        credentials: { password: "1234" },
    });
}));
describe("CRUD identity", () => {
    it("identity should be created well with valid payload", () => {
        expect(identity).toBeDefined();
    });
    it("identity cannot be created without sub (openid scope)", () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        yield expect(idp.create({
            metadata: { federation: {}, softDeleted: false },
            scope: ["openid", "profile", "email", "phone"],
            claims: { sub: identity.id, email: testEmail, name: "Tester", phone_number: "010-4477-1234" },
            credentials: { password: "1234" },
        })).rejects.toThrow();
    }));
    it("identity cannot be created with same sub", () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
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
    it("identity should have metadata", () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        yield expect(identity.metadata()).resolves
            .toEqual(expect.objectContaining({ softDeleted: false }));
    }));
    it("identity should have claims including base claims", () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
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
    it("identity could update own claims with validation", () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        yield expect(identity.updateClaims({
            email_verified: true,
            phone_number_verified: true,
        }).catch(err => console.error(err.error_detail))).resolves.not.toThrow();
        yield expect(identity.claims("userinfo", "email phone")).resolves
            .toEqual(expect.objectContaining({
            email_verified: true,
            phone_number_verified: true,
        }));
        yield expect(identity.updateClaims({
            sub: "abcdefg",
        })).rejects.toThrow();
    }));
    it("identity could assert and update own credentials", () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        yield expect(identity.assertCredentials({ password: "1234" })).resolves.toBeTruthy();
        yield expect(identity.assertCredentials({ password: "2345" })).resolves.toBeFalsy();
        yield expect(identity.updateCredentials({ password: "2345" })).resolves.toBeTruthy();
        yield expect(identity.updateCredentials({ password: "2345" })).resolves.toBeFalsy();
        yield expect(identity.assertCredentials({ password: "2345" })).resolves.toBeTruthy();
        yield expect(identity.updateCredentials({ password: "1234" })).resolves.toBeTruthy();
    }));
    it("identity could be soft deleted and restored", () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        yield expect(identity.isSoftDeleted()).resolves.not.toBeTruthy();
        yield expect(identity.delete(false)).resolves.not.toThrow();
        yield expect(identity.isSoftDeleted()).resolves.toBeTruthy();
        yield expect(identity.restoreSoftDeleted()).resolves.not.toThrow();
        yield expect(identity.isSoftDeleted()).resolves.not.toBeTruthy();
    }));
    it("identity could read and update metadata", () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        yield expect(identity.updateMetadata({ test: 12345 })).resolves.not.toThrow();
        yield expect(identity.metadata()).resolves.toEqual(expect.objectContaining({ test: 12345 }));
    }));
    it("identity could be fetched by id, email, phone_number", () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        yield expect(idp.find({ id: identity.id })).resolves.toEqual(expect.objectContaining({ id: identity.id }));
        yield expect(idp.find({ phone_number: "010 4477 1234" })).resolves.toEqual(expect.objectContaining({ id: identity.id }));
        yield expect(idp.find({ email: testEmail })).resolves.toEqual(expect.objectContaining({ id: identity.id }));
    }));
    it("identities could be fetched", () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        yield expect(idp.get()).resolves.toEqual(expect.arrayContaining([expect.objectContaining({ id: identity.id })]));
        yield expect(idp.count()).resolves.toBeGreaterThan(0);
    }));
});
describe("Dynamic scope and claims migration", () => {
    it("can add new claims with migration", () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        yield expect(idp.claims.defineClaimsSchema({
            scope: "profile",
            key: "note",
            validation: {
                type: "string",
                optional: true,
            },
        })).resolves.not.toThrow();
        yield expect(identity.claims("userinfo", "profile")).resolves.toEqual(expect.objectContaining({ note: null }));
        yield expect(idp.claims.defineClaimsSchema({
            scope: "whatever",
            key: "note",
            validation: {
                type: "string",
                optional: true,
            },
        })).resolves.not.toThrow();
        // scope moved...
        yield expect(identity.claims("userinfo", "profile")).resolves.toEqual(expect.not.objectContaining({ note: null }));
        yield expect(identity.claims("userinfo", "whatever")).resolves.toEqual(expect.objectContaining({ note: null }));
        // again with default vaule
        yield expect(idp.claims.defineClaimsSchema({
            scope: "profile",
            key: "note",
            validation: {
                type: "string",
                optional: false,
            },
            seed: "note-default-value",
        })).resolves.not.toThrow();
        yield expect(identity.claims("userinfo", "profile")).resolves.toEqual(expect.objectContaining({ note: "note-default-value" }));
    }));
    it("can add new claims with cutom migration function", () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        yield expect(idp.claims.defineClaimsSchema({
            scope: "profile",
            key: "score",
            validation: {
                type: "number",
            },
            seed: 0,
        })).resolves.not.toThrow();
        yield expect(idp.claims.defineClaimsSchema({
            scope: "profile",
            key: "score",
            validation: {
                type: "number",
                positive: true,
                default: 100,
            },
            seed: 1,
            migration: ((old, def, claims) => {
                return claims.email.length;
            }).toString(),
        })).resolves.not.toThrow();
        yield expect(identity.claims("userinfo", "profile")).resolves.toEqual(expect.objectContaining({ score: testEmail.length }));
    }));
});
describe("Complex claims definition and migration", () => {
    it("can create object claims", () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        yield expect(idp.claims.defineClaimsSchema({
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
            seed: {
                number: 1234,
                string: "test",
                strings: ["a", "b", "c", "d"],
            },
        })).resolves.not.toThrow();
        yield expect(identity.claims("complex").then(console.log)).resolves.not.toThrow();
    }));
});
describe("Permanently delete user", () => {
    it("can delete user and then user will not be found", () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const removal = yield idp.create({
            metadata: { federation: {}, softDeleted: false },
            scope: [],
            claims: { sub: uuid_1.default().substr(0, 16), name: "Test", email: "aa" + testEmail, note: "xasdasd" },
            credentials: { password: "1234" },
        });
        yield expect(removal.delete(true)).resolves.not.toThrow();
        yield expect(idp.find({ id: removal.id })).rejects.toThrow();
    }));
});
//# sourceMappingURL=adapter.memory.spec.js.map
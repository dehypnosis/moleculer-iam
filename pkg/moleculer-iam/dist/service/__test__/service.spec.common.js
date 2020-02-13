"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const uuid = tslib_1.__importStar(require("uuid"));
const provider_1 = require("../../oidc/provider");
function doCommonServiceTest(broker, service) {
    beforeAll(() => tslib_1.__awaiter(this, void 0, void 0, function* () {
        yield broker.start();
        yield broker.waitForServices("iam");
    }));
    afterAll(() => broker.stop());
    describe("iam.client.*", () => {
        it("iam.client.get", () => {
            return expect(broker.call("iam.client.get")).resolves.toEqual(expect.objectContaining({
                entries: expect.any(Array),
                total: expect.any(Number),
            }));
        });
        it("iam.client.count", () => {
            return expect(broker.call("iam.client.count")).resolves.toEqual(expect.any(Number));
        });
        it("iam.client.create/find/update/delete", () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const params = { client_id: "test-service-spec", client_name: "Test service spec", redirect_uris: ["https://test-service-spec.dummy.site.com/callback"] };
            yield broker.call("iam.client.delete", { id: params.client_id }).then(undefined, () => {
            });
            yield expect(broker.call("iam.client.create", params)).resolves.not.toThrow();
            yield expect(broker.call("iam.client.find", { id: params.client_id })).resolves.toEqual(expect.objectContaining(params));
            yield expect(broker.call("iam.client.update", Object.assign(Object.assign({}, params), { client_name: "updated" }))).resolves.toEqual(expect.objectContaining(Object.assign(Object.assign({}, params), { client_name: "updated" })));
            yield expect(broker.call("iam.client.delete", { id: params.client_id })).resolves.not.toThrow();
            yield expect(broker.call("iam.client.find", { id: params.client_id })).resolves.toBeFalsy();
        }));
    });
    describe("iam.model.*", () => {
        for (const kind of provider_1.OIDCProvider.volatileModelNames) {
            it(`iam.model.get/count/delete for ${kind}`, () => tslib_1.__awaiter(this, void 0, void 0, function* () {
                const where = { exp: { $gte: Math.floor(new Date().getTime() / 1000) } };
                const entries = yield broker.call("iam.model.get", { kind, where });
                if (entries.total > 0) {
                    expect(entries).toEqual(expect.objectContaining({
                        entries: expect.arrayContaining([expect.objectContaining({ jti: expect.any(String), kind })]),
                        total: expect.any(Number),
                    }));
                    yield expect(broker.call("iam.model.count", { kind, where })).resolves.toBeGreaterThan(0);
                    yield expect(broker.call("iam.model.delete", { kind, where })).resolves.toBeGreaterThan(0);
                }
                else {
                    expect(entries).toEqual(expect.objectContaining({
                        entries: expect.arrayContaining([]),
                        total: 0,
                    }));
                    yield expect(broker.call("iam.model.count", { kind, where })).resolves.toBe(0);
                    yield expect(broker.call("iam.model.delete", { kind, where })).resolves.toBe(0);
                }
            }));
        }
    });
    describe("iam.schema.*", () => {
        it("iam.schema.get/find", () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield expect(broker.call("iam.schema.get").then(undefined, console.error)).resolves.toEqual(expect.arrayContaining([
                expect.objectContaining({
                    scope: expect.any(String),
                    key: expect.any(String),
                    active: expect.any(Boolean),
                    validation: expect.anything(),
                    migration: expect.any(String),
                    version: expect.any(String),
                }),
            ]));
            yield expect(broker.call("iam.schema.get", { scope: ["profile"], active: true })).resolves.toEqual(expect.arrayContaining([
                expect.objectContaining({
                    scope: "profile",
                    key: expect.any(String),
                    active: true,
                    validation: expect.anything(),
                    migration: expect.any(String),
                    version: expect.any(String),
                }),
            ]));
            yield expect(broker.call("iam.schema.find", { key: "email", active: true })).resolves.toEqual(expect.objectContaining({
                scope: "email",
                key: "email",
                active: true,
                validation: expect.anything(),
                migration: expect.any(String),
                version: expect.any(String),
            }));
        }));
        it("iam.schema.define", () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield expect(broker.call("iam.schema.define", { key: "test-will-throw" })).rejects.toThrow(expect.objectContaining({ code: 422 }));
            yield expect(broker.call("iam.schema.define", {
                key: "useless_claim",
                scope: "_test",
                validation: "string",
            })).resolves.toEqual(expect.objectContaining({
                key: "useless_claim",
                scope: "_test",
                validation: "string",
                active: true,
                version: expect.any(String),
                migration: expect.any(String),
            }));
        }));
    });
    describe("iam.id.*", () => {
        it("iam.id.validate/validateCredentials", () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            // validate payload in pre-flight
            yield expect(broker.call("iam.id.validate", { scope: "email" })).rejects.toThrow(expect.objectContaining({
                code: 422,
                data: expect.arrayContaining([
                    expect.objectContaining({ field: "email" }),
                ]),
            }));
            // can validate credentials together
            yield expect(broker.call("iam.id.validate", { scope: "email", credentials: { password: "123" } })).rejects.toThrow(expect.objectContaining({
                code: 422,
                data: expect.arrayContaining([
                    expect.objectContaining({ field: "email" }),
                ]),
            }));
            // can just validate credentials
            yield expect(broker.call("iam.id.validateCredentials", { password: "123" })).rejects.toThrow(expect.objectContaining({
                code: 422,
                data: expect.arrayContaining([
                    expect.objectContaining({ field: "password" }),
                ]),
            }));
        }));
        it("iam.id.create/update/delete/restore and find", () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            // invalid payload
            yield expect(broker.call("iam.id.create", {})).rejects.toThrow(expect.objectContaining({
                code: 422,
                data: expect.arrayContaining([
                    expect.objectContaining({ field: "email" }),
                    expect.objectContaining({ field: "name" }),
                ]),
            }));
            // valid payload
            const email = `${uuid.v4().substr(0, 16)}@test-iam-service.com`;
            let identity;
            yield expect(broker.call("iam.id.create", {
                scope: "email openid profile",
                claims: {
                    email,
                    name: "Service Tester",
                },
                credentials: {
                    password: "12341234",
                },
            })
                .then(res => (identity = res))).resolves.toEqual(expect.objectContaining({
                claims: expect.objectContaining({ email }),
            }));
            // update
            yield expect(broker.call("iam.id.update", {
                id: identity.id,
                scope: "profile",
                claims: { name: "updated" },
                metadata: { whatever: "nothing" },
            })).resolves.toEqual(expect.objectContaining({
                id: identity.id,
                claims: expect.objectContaining({ name: "updated" }),
                metadata: expect.objectContaining({ whatever: "nothing" }),
            }));
            // delete (soft)
            yield expect(broker.call("iam.id.delete", {
                id: identity.id,
                permanently: false,
            })).resolves.toEqual(identity.id);
            // check soft delete
            yield expect(broker.call("iam.id.find", {
                id: identity.id,
                metadata: {
                    softDeleted: false,
                },
            })).resolves.toBeFalsy();
            yield expect(broker.call("iam.id.find", {
                where: {
                    id: identity.id,
                    metadata: {
                        softDeleted: true,
                    },
                },
            })).resolves.toBeTruthy();
            // restore
            yield expect(broker.call("iam.id.restore", {
                id: identity.id,
            })).resolves.toEqual(identity.id);
            // check restored
            yield expect(broker.call("iam.id.find", {
                id: identity.id,
            })).resolves.toBeTruthy();
            // delete (hard)
            yield expect(broker.call("iam.id.delete", {
                id: identity.id,
                permanently: true,
            })).rejects.toThrow(); // requires soft delete first
            yield expect(broker.call("iam.id.delete", {
                id: identity.id,
                permanently: false,
            })).resolves.toEqual(identity.id);
            yield expect(broker.call("iam.id.delete", {
                id: identity.id,
                permanently: true,
            })).resolves.toEqual(identity.id);
            // check hard deleted
            yield expect(broker.call("iam.id.find", {
                where: {
                    id: identity.id,
                    metadata: {
                        softDeleted: true,
                    },
                },
            })).resolves.toBeFalsy();
        }));
        it("iam.id.get/count", () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const where = {
                claims: {
                    email: { $like: "%@%" },
                },
            };
            let result;
            yield expect(broker.call("iam.id.get", {
                where,
                limit: 5,
            })
                .then(res => result = res)).resolves.not.toThrow();
            expect(result).toEqual(expect.objectContaining({
                entries: expect.arrayContaining(result && result.total > 0 ? [
                    expect.objectContaining({
                        id: expect.any(String),
                        claims: expect.anything(),
                        metadata: expect.anything(),
                    }),
                ] : []),
                total: expect.any(Number),
            }));
            yield expect(broker.call("iam.id.count", { where })).resolves.toBe(result.total);
        }));
        // used to force refresh identity cache from external changes
        it("iam.id.refresh", () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const idp = service.idp;
            const originalRefresher = idp.adapter.onClaimsUpdated;
            const mockedRefresher = jest.fn();
            idp.adapter.onClaimsUpdated = mockedRefresher;
            const email = `${uuid.v4().substr(0, 16)}@test-iam-service.com`;
            let identity;
            yield expect(idp.create({
                scope: "email openid profile",
                claims: {
                    email,
                    name: "Service Tester2",
                },
                credentials: {
                    password: "12341234",
                },
                metadata: {},
            }).then(id => id.json()).then(i => identity = i)).resolves.toEqual(expect.objectContaining({ claims: expect.objectContaining({ email }) }));
            expect(mockedRefresher).toHaveBeenCalledWith(identity.id, expect.anything(), expect.anything());
            // not all adapter requires/implements refreshing and cache mechanism
            // await expect(broker.call("iam.id.find", {email})).resolves.toBeFalsy();
            idp.adapter.onClaimsUpdated = originalRefresher;
            mockedRefresher.mockClear();
            yield expect(broker.call("iam.id.refresh", { id: identity.id })).resolves.not.toThrow();
            expect(mockedRefresher).not.toBeCalled();
            yield expect(broker.call("iam.id.find", { email })).resolves.toBeTruthy();
        }));
    });
}
exports.doCommonServiceTest = doCommonServiceTest;
//# sourceMappingURL=service.spec.common.js.map
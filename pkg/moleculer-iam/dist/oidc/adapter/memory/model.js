"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const model_1 = require("../model");
const grantKeyFor = (id) => `grant:${id}`;
const sessionUidKeyFor = (id) => `sessionUid:${id}`;
const userCodeKeyFor = (userCode) => `userCode:${userCode}`;
class OIDCMemoryModel extends model_1.OIDCModel {
    constructor(props, storage) {
        super(props);
        this.props = props;
        this.storage = storage;
    }
    consume(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.storage.get(id).consumed = Math.floor(Date.now() / 1000);
        });
    }
    delete() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const size = this.storage.itemCount;
            this.storage.reset();
            return size;
        });
    }
    destroy(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.storage.del(id);
        });
    }
    find(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.storage.get(id);
        });
    }
    get(args) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!args) {
                args = {};
            }
            if (typeof args.offset === "undefined") {
                args.offset = 0;
            }
            if (typeof args.limit === "undefined") {
                args.limit = 10;
            }
            return this.storage.values().slice(args.offset, args.limit);
        });
    }
    count(args) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.storage.length;
        });
    }
    findByUid(uid) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const id = this.storage.get(sessionUidKeyFor(uid));
            return this.find(id);
        });
    }
    findByUserCode(userCode) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const id = this.storage.get(userCodeKeyFor(userCode));
            return this.find(id);
        });
    }
    revokeByGrantId(grantId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return undefined;
        });
    }
    upsert(id, data, expiresIn) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const key = id;
            if (this.name === "Session") {
                this.storage.set(sessionUidKeyFor(data.uid), id, expiresIn * 1000);
            }
            const { grantId, userCode } = data;
            if (grantId) {
                const grantKey = grantKeyFor(grantId);
                const grant = this.storage.get(grantKey);
                if (!grant) {
                    this.storage.set(grantKey, [key]);
                }
                else {
                    grant.push(key);
                }
            }
            if (userCode) {
                this.storage.set(userCodeKeyFor(userCode), id, expiresIn * 1000);
            }
            this.storage.set(key, data, expiresIn * 1000);
        });
    }
}
exports.OIDCMemoryModel = OIDCMemoryModel;
//# sourceMappingURL=model.js.map
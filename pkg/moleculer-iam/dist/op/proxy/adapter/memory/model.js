"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_1 = require("../model");
const grantKeyFor = (id) => `grant:${id}`;
const sessionUidKeyFor = (id) => `sessionUid:${id}`;
const userCodeKeyFor = (userCode) => `userCode:${userCode}`;
class OIDCMemoryModelProxy extends model_1.OIDCModelProxy {
    constructor(props, storage) {
        super(props);
        this.props = props;
        this.storage = storage;
    }
    async consume(id) {
        this.storage.get(id).consumed = Math.floor(Date.now() / 1000);
    }
    async delete() {
        const size = this.storage.itemCount;
        this.storage.reset();
        return size;
    }
    async destroy(id) {
        this.storage.del(id);
    }
    async find(id) {
        return this.storage.get(id);
    }
    async get(args) {
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
    }
    async count(args) {
        return this.storage.length;
    }
    async findByUid(uid) {
        const id = this.storage.get(sessionUidKeyFor(uid));
        return this.find(id);
    }
    async findByUserCode(userCode) {
        const id = this.storage.get(userCodeKeyFor(userCode));
        return this.find(id);
    }
    async revokeByGrantId(grantId) {
        return undefined;
    }
    async upsert(id, data, expiresIn) {
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
    }
}
exports.OIDCMemoryModelProxy = OIDCMemoryModelProxy;
//# sourceMappingURL=model.js.map
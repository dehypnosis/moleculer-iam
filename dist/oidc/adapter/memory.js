"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const adapter_1 = require("./adapter");
const lru_cache_1 = tslib_1.__importDefault(require("lru-cache"));
class OIDCModelMemoryAdapter extends adapter_1.OIDCModelAdapter {
    constructor(props, options) {
        super(props);
        this.props = props;
        this.storage = new lru_cache_1.default(options);
    }
    consume(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.storage.get(id).consumed = Math.floor(Date.now() / 1000);
        });
    }
    destroy(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.storage.del(id);
        });
    }
    find(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.storage.get(id) || null;
        });
    }
    get(opts) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!opts)
                opts = {};
            if (typeof opts.offset === "undefined")
                opts.offset = 0;
            if (typeof opts.limit === "undefined")
                opts.limit = 10;
            return this.storage.values().slice(opts.offset, opts.limit);
        });
    }
    count() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.storage.length;
        });
    }
    findByUid(uid) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const id = this.storage.get(OIDCModelMemoryAdapter.sessionUidKeyFor(uid));
            return this.find(id);
        });
    }
    findByUserCode(userCode) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const id = this.storage.get(OIDCModelMemoryAdapter.userCodeKeyFor(userCode));
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
                this.storage.set(OIDCModelMemoryAdapter.sessionUidKeyFor(data.uid), id, expiresIn * 1000);
            }
            const { grantId, userCode } = data;
            if (grantId) {
                const grantKey = OIDCModelMemoryAdapter.grantKeyFor(grantId);
                const grant = this.storage.get(grantKey);
                if (!grant) {
                    this.storage.set(grantKey, [key]);
                }
                else {
                    grant.push(key);
                }
            }
            if (userCode) {
                this.storage.set(OIDCModelMemoryAdapter.userCodeKeyFor(userCode), id, expiresIn * 1000);
            }
            this.storage.set(key, data, expiresIn * 1000);
        });
    }
}
exports.OIDCModelMemoryAdapter = OIDCModelMemoryAdapter;
OIDCModelMemoryAdapter.grantKeyFor = (id) => `grant:${id}`;
OIDCModelMemoryAdapter.sessionUidKeyFor = (id) => `sessionUid:${id}`;
OIDCModelMemoryAdapter.userCodeKeyFor = (userCode) => `userCode:${userCode}`;
//# sourceMappingURL=memory.js.map
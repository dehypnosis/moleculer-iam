"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const model_1 = require("../model");
function getEntryData(entry) {
    return Object.assign(Object.assign({}, entry.data), (entry.consumedAt ? { consumed: true } : undefined));
}
// tslint:disable-next-line:class-name
class OIDC_RDBMS_Model extends model_1.OIDCModel {
    constructor(props, model) {
        super(props);
        this.props = props;
        this.model = model;
    }
    consume(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.model.update({ consumedAt: new Date() }, { where: { id } });
        });
    }
    count(...args) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.model.count();
        });
    }
    destroy(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.model.destroy({ where: { id } });
        });
    }
    find(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const found = yield this.model.findByPk(id);
            if (!found) {
                return undefined;
            }
            return getEntryData(found);
        });
    }
    findByUid(uid) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const found = yield this.model.findOne({ where: { uid } });
            if (!found) {
                return undefined;
            }
            return getEntryData(found);
        });
    }
    findByUserCode(userCode) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const found = yield this.model.findOne({ where: { userCode } });
            if (!found) {
                return undefined;
            }
            return getEntryData(found);
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
            const founds = yield this.model.findAll(opts);
            return founds.map(getEntryData);
        });
    }
    revokeByGrantId(grantId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.model.destroy({ where: { grantId } });
        });
    }
    upsert(id, data, expiresIn) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.model.upsert(Object.assign(Object.assign(Object.assign(Object.assign({ id,
                data }, (data.grantId ? { grantId: data.grantId } : undefined)), (data.userCode ? { userCode: data.userCode } : undefined)), (data.uid ? { uid: data.uid } : undefined)), (expiresIn ? { expiresAt: new Date(Date.now() + (expiresIn * 1000)) } : undefined)));
        });
    }
}
exports.OIDC_RDBMS_Model = OIDC_RDBMS_Model;
//# sourceMappingURL=model.js.map
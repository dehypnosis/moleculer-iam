"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_1 = require("../model");
function getEntryData(entry) {
    return {
        ...entry.data,
        ...(typeof entry.consumedAt !== "undefined" ? { consumed: !!entry.consumedAt } : undefined),
    };
}
// tslint:disable-next-line:class-name
class OIDC_RDBMS_Model extends model_1.OIDCModel {
    constructor(props, model) {
        super(props);
        this.props = props;
        this.model = model;
    }
    async consume(id) {
        await this.model.update({ consumedAt: new Date() }, { where: { id } });
    }
    async destroy(id) {
        await this.model.destroy({ where: { id } });
    }
    async find(id) {
        const found = await this.model.findByPk(id);
        if (!found) {
            return undefined;
        }
        return getEntryData(found);
    }
    async findByUid(uid) {
        const found = await this.model.findOne({ where: { uid } });
        if (!found) {
            return undefined;
        }
        return getEntryData(found);
    }
    async findByUserCode(userCode) {
        const found = await this.model.findOne({ where: { userCode } });
        if (!found) {
            return undefined;
        }
        return getEntryData(found);
    }
    async get(args = {}) {
        if (typeof args.offset === "undefined")
            args.offset = 0;
        if (typeof args.limit === "undefined")
            args.limit = 10;
        if (args && args.where) {
            args = { ...args, where: { data: args.where } };
        }
        const founds = await this.model.findAll(args);
        return founds.map(getEntryData);
    }
    async delete(args = {}) {
        if (typeof args.offset === "undefined")
            args.offset = 0;
        if (typeof args.limit === "undefined")
            args.limit = 10;
        if (args && args.where) {
            args = { ...args, where: { data: args.where } };
        }
        return this.model.destroy(args);
    }
    async count(args) {
        if (args) {
            args = { where: { data: args } };
        }
        return this.model.count(args);
    }
    async revokeByGrantId(grantId) {
        await this.model.destroy({ where: { grantId } });
    }
    async upsert(id, data, expiresIn) {
        await this.model.upsert({
            id,
            data,
            ...(data.grantId ? { grantId: data.grantId } : undefined),
            ...(data.userCode ? { userCode: data.userCode } : undefined),
            ...(data.uid ? { uid: data.uid } : undefined),
            ...(expiresIn ? { expiresAt: new Date(Date.now() + (expiresIn * 1000)) } : undefined),
        });
    }
}
exports.OIDC_RDBMS_Model = OIDC_RDBMS_Model;
//# sourceMappingURL=model.js.map
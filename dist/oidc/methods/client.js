"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const kleur = tslib_1.__importStar(require("kleur"));
const base_1 = require("../base");
function createClientMethods(base) {
    const model = base.getModel("Client");
    return {
        find(id) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                return model.find(id);
            });
        },
        findOrFail(id) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                const client = yield this.find(id);
                if (!client) {
                    throw new base_1.errors.InvalidClient("client not found");
                }
                return client;
            });
        },
        create(metadata) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                if (metadata.client_id && (yield this.find(metadata.client_id))) {
                    throw new base_1.errors.InvalidClient("client_id is duplicated");
                }
                base.logger.info(`create client ${kleur.cyan(metadata.client_id)}:`, metadata);
                const client = yield base.originalMap.clientAdd(metadata, { store: true });
                return client.metadata();
            });
        },
        update(metadata) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                yield this.find(metadata.client_id);
                base.logger.info(`update client ${kleur.cyan(metadata.client_id || "<unknown>")}:`, metadata);
                const client = yield base.originalMap.clientAdd(metadata, { store: true });
                return client.metadata();
            });
        },
        remove(id) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                yield this.findOrFail(id);
                base.logger.info(`remove client ${kleur.cyan(id)}`);
                base.originalMap.clientRemove(id);
            });
        },
        get(opts) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                return yield model.get(opts);
            });
        },
        count() {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                return model.count();
            });
        },
    };
}
exports.createClientMethods = createClientMethods;
//# sourceMappingURL=client.js.map
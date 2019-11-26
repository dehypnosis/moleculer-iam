"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const lru_cache_1 = tslib_1.__importDefault(require("lru-cache"));
const adapter_1 = require("../adapter");
const model_1 = require("./model");
class OIDCMemoryAdapter extends adapter_1.OIDCAdapter {
    constructor(props, options) {
        super(props);
        this.props = props;
        this.models = new Map();
        this.storage = new lru_cache_1.default(options);
    }
    createModel(name) {
        return new model_1.OIDCMemoryModel({
            name,
            logger: this.logger,
        }, this.storage);
    }
}
exports.OIDCMemoryAdapter = OIDCMemoryAdapter;
//# sourceMappingURL=adapter.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const lru_cache_1 = tslib_1.__importDefault(require("lru-cache"));
const adapter_1 = require("../adapter");
const model_1 = require("./model");
// tslint:disable-next-line:class-name
class OIDCMemoryAdapterProxy extends adapter_1.OIDCAdapterProxy {
    constructor(props, options) {
        super(props);
        this.props = props;
        this.options = options;
        this.displayName = "Memory";
    }
    createModel(props) {
        return new model_1.OIDCMemoryModelProxy(props, new lru_cache_1.default(this.options));
    }
}
exports.OIDCMemoryAdapterProxy = OIDCMemoryAdapterProxy;
//# sourceMappingURL=adapter.js.map
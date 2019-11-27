"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const _ = tslib_1.__importStar(require("lodash"));
const types_1 = require("./types");
const adapter_1 = require("../adapter");
const options_1 = require("./options");
const debug_1 = require("./debug");
// @ts-ignore : need to hack oidc-provider private methods
const weak_cache_1 = tslib_1.__importDefault(require("oidc-provider/lib/helpers/weak_cache"));
class OIDCProviderBase {
    constructor(props, options) {
        this.props = props;
        const { issuer, trustProxy } = props;
        const logger = this.logger = props.logger || console;
        /* create adapter */
        const adapterConfig = _.defaultsDeep(props.adapter || {}, {
            type: "Memory",
            options: {},
        });
        const adapterKey = Object.keys(adapter_1.OIDCAdapterConstructors).find(k => k.toLowerCase() === adapterConfig.type.toLowerCase())
            || Object.keys(adapter_1.OIDCAdapterConstructors)[0];
        this.adapter = new adapter_1.OIDCAdapterConstructors[adapterKey]({
            logger,
        }, adapterConfig.options);
        /* create original provider */
        options = _.defaultsDeep(options || {}, options_1.defaultOIDCProviderBaseOptions);
        const original = this.original = new types_1.Provider(issuer, Object.assign(Object.assign({}, options), { adapter: this.adapter.originalAdapterProxy }));
        original.proxy = trustProxy !== false;
        // apply debugging features
        if (issuer.startsWith("http://")) {
            debug_1.applyDebugOptions(original, logger, {
                "disable-implicit-forbid-localhost": true,
                "disable-implicit-force-https": true,
            });
        }
        // get hidden map of provider instance which contains private properties
        this.originalMap = weak_cache_1.default(original);
    }
    getModel(name) {
        return this.adapter.getModel(name);
    }
    /* will be used by http servers */
    get httpRequestHandler() {
        return this.original.callback;
    }
    /* lifecycle */
    start() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            // start adapter
            yield this.adapter.start();
        });
    }
    stop() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            // stop adapter
            yield this.adapter.stop();
        });
    }
}
exports.OIDCProviderBase = OIDCProviderBase;
//# sourceMappingURL=base.js.map
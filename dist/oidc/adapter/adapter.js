"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const base_1 = require("../base");
class OIDCAdapter {
    constructor(props, options) {
        this.props = props;
        this.models = new Map();
        this.logger = console;
        this.initialized = false;
        if (props.logger) {
            this.logger = props.logger;
        }
        // original oidc-provider create models lazilly but OIDCAdapter create all models before start and get cached models on demand
        const self = this;
        // tslint:disable-next-line:max-classes-per-file
        this.originalAdapterProxy = class OriginalAdapterProxy {
            constructor(name) {
                return self.getModel(name);
            }
        };
    }
    getModel(name) {
        // initialize all models once
        if (!this.initialized) {
            // create all models
            for (const modelName of base_1.OIDCModelNames) {
                this.models.set(modelName, this.createModel(modelName));
            }
            this.initialized = true;
        }
        // find model
        const model = this.models.get(name);
        if (!model) {
            throw new Error("model not found: adapter did not created the model: " + name);
        }
        return model;
    }
    /**
     * Lifecycle methods: do sort of DBMS schema migration and making connection
     */
    start() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.logger.info(`OIDC adapter has been started`);
        });
    }
    stop() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.logger.info(`OIDC adapter has been stopped`);
        });
    }
}
exports.OIDCAdapter = OIDCAdapter;
//# sourceMappingURL=adapter.js.map
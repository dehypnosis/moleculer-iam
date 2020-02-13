"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const provider_1 = require("../provider");
const kleur_1 = tslib_1.__importDefault(require("kleur"));
class OIDCAdapter {
    constructor(props, options) {
        this.props = props;
        this.models = new Map();
        this.initialized = false;
        this.logger = props.logger || console;
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
            for (const modelName of provider_1.OIDCModelNames) {
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
            this.logger.info(`${kleur_1.default.blue(this.displayName)} oidc provider adapter has been started`);
        });
    }
    stop() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.logger.info(`${kleur_1.default.blue(this.displayName)} oidc provider adapter has been stopped`);
        });
    }
}
exports.OIDCAdapter = OIDCAdapter;
//# sourceMappingURL=adapter.js.map
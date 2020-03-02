"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const kleur = tslib_1.__importStar(require("kleur"));
const model_1 = require("./model");
class OIDCAdapterProxy {
    constructor(props) {
        this.props = props;
        this.models = new Map();
        this.initialized = false;
        this.logger = props.logger;
        // original oidc-provider create models lazilly but OIDCAdapter create all models before start and get cached models on demand
        const self = this;
        // tslint:disable-next-line:max-classes-per-file
        this.adapterConstructorProxy = class AdapterConstructorProxy {
            constructor(name) {
                return self.getModel(name);
            }
        };
    }
    getModel(name) {
        // initialize all models once
        if (!this.initialized) {
            // create all models
            for (const modelName of model_1.OIDCModelNames) {
                this.models.set(modelName, this.createModel({
                    name: modelName,
                    logger: this.logger,
                }));
            }
            this.initialized = true;
        }
        // find model
        const model = this.models.get(name);
        if (!model) {
            throw new Error("model not found: adapter proxy did not created the model: " + name);
        }
        return model;
    }
    /**
     * Lifecycle methods: do sort of DBMS schema migration and making connection
     */
    async start() {
        this.logger.info(`${kleur.blue(this.displayName)} oidc provider adapter proxy has been started`);
    }
    async stop() {
        this.logger.info(`${kleur.blue(this.displayName)} oidc provider adapter proxy has been stopped`);
    }
}
exports.OIDCAdapterProxy = OIDCAdapterProxy;
//# sourceMappingURL=adapter.js.map
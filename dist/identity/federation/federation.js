"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const _ = tslib_1.__importStar(require("lodash"));
const options_1 = require("./options");
class IdentityFederationManager {
    constructor(props, opts) {
        this.props = props;
        this.logger = props.logger || console;
        // compile payload validation functions
        // this.validatePayload = validator.compile(IdentityClaimsSchemaPayloadValidationSchema);
        // prepare base claims
        this.options = _.defaultsDeep(opts || {}, options_1.defaultIdentityFederationManagerOptions);
    }
    /* lifecycle */
    start() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.logger.info("identity federation manager has been started");
        });
    }
    stop() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.logger.info("identity federation manager has been stopped");
        });
    }
}
exports.IdentityFederationManager = IdentityFederationManager;
//# sourceMappingURL=federation.js.map
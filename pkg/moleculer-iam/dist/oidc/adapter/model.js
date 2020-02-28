"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const provider_1 = require("../provider");
exports.OIDCModelPayload = provider_1.OIDCModelPayload;
exports.OIDCModelName = provider_1.OIDCModelName;
exports.OIDCModelNames = provider_1.OIDCModelNames;
exports.OIDCGrantModelNames = provider_1.OIDCGrantModelNames;
class OIDCModel {
    /**
     *
     * Creates an instance of MyAdapter for an oidc-provider model.
     *
     * @constructor
     * @param props
     *
     * @param props.name "AuthorizationCode", "RefreshToken", "ClientCredentials", "Client", "InitialAccessToken",
     * "RegistrationAccessToken", "DeviceCode", "Interaction", "ReplayDetection", or "PushedAuthorizationRequest"
     * @param props.logger
     * @param options
     */
    constructor(props, options) {
        this.props = props;
        this.logger = console;
        if (props.logger) {
            this.logger = props.logger;
        }
        this.logger.info(`${this.name} oidc model has been created`);
    }
    get name() {
        return this.props.name;
    }
}
exports.OIDCModel = OIDCModel;
//# sourceMappingURL=model.js.map
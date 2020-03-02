"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OIDCModelNames = [
    "Session",
    "AccessToken",
    "AuthorizationCode",
    "RefreshToken",
    "DeviceCode",
    "ClientCredentials",
    "Client",
    "InitialAccessToken",
    "RegistrationAccessToken",
    "Interaction",
    "ReplayDetection",
    "PushedAuthorizationRequest",
];
exports.OIDCGrantModelNames = [
    "AccessToken",
    "AuthorizationCode",
    "RefreshToken",
    "DeviceCode",
];
exports.OIDCVolatileModelNames = [
    "Session",
    "AccessToken",
    "AuthorizationCode",
    "RefreshToken",
    "DeviceCode",
    "InitialAccessToken",
    "RegistrationAccessToken",
    "Interaction",
    "ReplayDetection",
    "PushedAuthorizationRequest",
];
class OIDCModelProxy {
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
        this.logger = props.logger;
        this.logger.info(`${this.name} oidc model proxy has been created`);
    }
    get name() {
        return this.props.name;
    }
}
exports.OIDCModelProxy = OIDCModelProxy;
//# sourceMappingURL=model.js.map
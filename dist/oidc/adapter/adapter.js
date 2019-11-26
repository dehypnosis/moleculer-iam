"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
class OIDCAdapter {
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
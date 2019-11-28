"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
class IdentityProvider {
    constructor(props, opts) {
        this.props = props;
        /* lifecycle */
        this.working = false;
        this.logger = props.logger || console;
    }
    start() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this.working) {
                return;
            }
            // ...
            this.logger.info("identity provider has been started");
            this.working = true;
        });
    }
    stop() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!this.working) {
                return;
            }
            // ...
            this.logger.info("identity provider has been stopped");
            this.working = false;
        });
    }
    find(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return {};
        });
    }
    createRegistrationSession(payload) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return {};
        });
    }
    register(payload) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return {};
        });
    }
    update(payload) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return {};
        });
    }
    updateCredentials() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
        });
    }
    remove(id, opts) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
        });
    }
    get(opts) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return [];
        });
    }
    findEmail() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
        });
    } // secondary email, or mobile
    /* federation */
    federateOtherProvider() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
        });
    }
    federateCustomSource() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
        });
    }
    /* verification */
    verifyEmail() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
        });
    }
    sendEmailVerificationCode() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
        });
    } // different model with identity itself for volatile registration
    verifyMobile() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
        });
    }
    sendMobileVerificationCode() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
        });
    } // different model with identity itself for volatile registration
}
exports.IdentityProvider = IdentityProvider;
//# sourceMappingURL=provider.js.map
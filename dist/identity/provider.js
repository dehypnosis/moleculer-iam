"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const identity_1 = require("./identity");
const error_1 = require("./error");
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
            return new identity_1.Identity(id, {
                name: "Dong Wook Kim",
                picture: "https://static2.sharepointonline.com/files/fabric/office-ui-fabric-react-assets/persona-female.png",
                email: id,
            });
        });
    }
    findByEmail(email) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!email.endsWith(".com")) {
                throw error_1.IdentityNotExistsError;
            }
            return new identity_1.Identity(email, {
                name: "Dong Wook Kim",
                picture: "https://static2.sharepointonline.com/files/fabric/office-ui-fabric-react-assets/persona-female.png",
                email,
            });
        });
    }
    findByPhone(phone) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return new identity_1.Identity("find-by-phone@gmail.com", {
                name: "Dong Wook Kim",
                picture: "https://static2.sharepointonline.com/files/fabric/office-ui-fabric-react-assets/persona-female.png",
                email: "find-by-phone@gmail.com",
                phone,
            });
        });
    }
    assertCredentials(id, credentials) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (credentials.password !== "1234") {
                throw error_1.InvalidCredentialsError;
            }
        });
    }
    updateCredentials(id, credentials) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (credentials.password !== "1234") {
                throw error_1.InvalidCredentialsError;
            }
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
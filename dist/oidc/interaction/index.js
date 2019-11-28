"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const interaction_1 = require("./interaction");
const error_1 = require("./internal/error");
const logout_1 = require("./internal/logout");
const device_1 = require("./internal/device");
var router_1 = require("./router");
exports.createInteractionRouter = router_1.createInteractionRouter;
exports.interactionConfiguration = {
    interactions: interaction_1.interactions,
    renderError: error_1.renderError,
    logoutSource: logout_1.logoutSource,
    postLogoutSuccessSource: logout_1.postLogoutSuccessSource,
    features: {
        deviceFlow: {
            userCodeInputSource: device_1.userCodeInputSource,
            userCodeConfirmSource: device_1.userCodeConfirmSource,
            successSource: device_1.successSource,
        },
    },
};
//# sourceMappingURL=index.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moleculer_1 = require("moleculer");
const moleculer_qmit_1 = require("moleculer-qmit");
const __1 = require("../../");
const config_1 = require("./config");
exports.isDebug = config_1.config.isDebug, exports.isDev = config_1.config.isDev;
// create service broker
exports.broker = new moleculer_1.ServiceBroker(moleculer_qmit_1.createBrokerOptions({
    logLevel: exports.isDebug ? "debug" : "info",
}));
// create IAM service
exports.broker.createService(__1.IAMServiceSchema({
    idp: {},
    oidc: Object.assign({ app: {
            isValidPath: path => path === "/" || path === "/my" || path.startsWith("/my/"),
        }, issuer: exports.isDev ? "https://account.dev.qmit.pro" : "https://account.qmit.pro" }, config_1.config.oidc),
    server: {
        http: {
            hostname: "0.0.0.0",
            port: 8080,
        },
    },
}));
//# sourceMappingURL=iam.js.map
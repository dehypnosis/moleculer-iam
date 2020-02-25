"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../../");
const moleculer_1 = require("moleculer");
const app_1 = require("./app");
// create moleculer service (optional)
const broker = new moleculer_1.ServiceBroker({
    transporter: {
        type: "TCP",
        options: {
            udpPeriod: 1,
        },
    },
    cacher: "Memory",
});
const serviceSchema = __1.IAMServiceSchema({
    idp: {
        adapter: {
            // type: "Memory",
            type: "RDBMS",
            options: {
                dialect: "mysql",
                host: "mysql-dev.internal.qmit.pro",
                database: "iam",
                username: "iam",
                password: "iam",
                sqlLogLevel: "debug",
            },
        },
    },
    oidc: {
        issuer: "http://localhost:9090",
        devMode: true,
        adapter: {
            // type: "Memory",
            type: "RDBMS",
            options: {
                dialect: "mysql",
                host: "mysql-dev.internal.qmit.pro",
                database: "iam",
                username: "iam",
                password: "iam",
                sqlLogLevel: "debug",
            },
        },
        // required and should be shared between processes in production
        cookies: {
            keys: ["blabla", "any secrets to encrypt", "cookies"],
        },
        // required and should be shared between processes in production
        jwks: require("./jwks.json"),
        interaction: {
            // federation
            federation: {
            /*
            kakao: {
              clientID: "XXX",
              clientSecret: "YYY",
            },
            google: {
              clientID: "XXX",
              clientSecret: "YYY",
            },
            facebook: {
              clientID: "XXX",
              clientSecret: "YYY",
            },
            */
            },
        },
        discovery: {
            ui_locales_supported: ["en-US", "ko-KR"],
            claims_locales_supported: ["en-US", "ko-KR"],
            op_tos_uri: "/help/tos",
            op_policy_uri: "/help/policy",
            service_documentation: "/help",
        },
    },
    server: {
        app: app_1.app,
        http: {
            hostname: "localhost",
            port: 9090,
        },
    },
});
broker.createService(serviceSchema);
broker.start();
//# sourceMappingURL=index.js.map
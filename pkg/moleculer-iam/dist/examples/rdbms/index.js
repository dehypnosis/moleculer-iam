"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moleculer_1 = require("moleculer");
const app_1 = require("./app");
const __1 = require("../../"); // "moleculer-iam";
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
    op: {
        issuer: "http://localhost:9090",
        dev: true,
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
        app: {
            // federation
            federation: {
                google: {
                    clientID: "XXX",
                    clientSecret: "YYY",
                },
                facebook: {
                    clientID: "XXX",
                    clientSecret: "YYY",
                },
                kakao: {
                    clientID: "XXX",
                    clientSecret: "YYY",
                },
            },
            renderer: {
                // factory: require("moleculer-iam-app-renderer"), // this is default behavior
                options: {
                    logo: {
                        uri: "https://upload.wikimedia.org/wikipedia/commons/a/a2/OpenID_logo_2.svg",
                        align: "flex-start",
                        height: "50px",
                        width: "133px",
                    },
                    login: {
                        federationOptionsVisibleDefault: false,
                    },
                    themes: {
                        default: {
                            themePrimary: "#ff6500",
                            themeLighterAlt: "#f6f7fe",
                            themeLighter: "#fce1f3",
                            themeLight: "#facfd4",
                            themeTertiary: "#f4909a",
                            themeSecondary: "#ef7551",
                            themeDarkAlt: "#d54627",
                            themeDark: "#bc4014",
                            themeDarker: "#a23414",
                        },
                    },
                },
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
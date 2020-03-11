"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moleculer_1 = require("moleculer");
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
            type: "Memory",
        },
    },
    op: {
        issuer: "http://localhost:9090",
        dev: true,
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
                },
            },
        },
        discovery: {
            ui_locales_supported: ["en-US", "ko-KR"],
            claims_locales_supported: ["en-US", "ko-KR"],
        },
    },
    server: {
        http: {
            hostname: "localhost",
            port: 9090,
        },
    },
});
broker.createService(serviceSchema);
broker.start();
//# sourceMappingURL=index.js.map
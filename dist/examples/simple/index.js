"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../../");
const moleculer_1 = require("moleculer");
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
        issuer: "http://localhost:8080",
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
        features: {
        // devInteractions: ({ enabled: true }) as never,
        },
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
    server: {
        http: {
            hostname: "localhost",
            port: 8080,
        },
    },
});
broker.createService(serviceSchema);
broker.start();
//# sourceMappingURL=index.js.map
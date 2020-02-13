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
            type: "Memory",
        },
    },
    oidc: {
        issuer: "http://localhost:9090",
        devMode: true,
        adapter: {
            type: "Memory",
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
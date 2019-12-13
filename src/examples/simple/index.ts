"use strict";

import { IAMServiceSchema } from "../../";
import { ServiceBroker } from "moleculer";

// create moleculer service (optional)
const broker = new ServiceBroker({
  transporter: {
    type: "TCP",
    options: {
      udpPeriod: 1,
    },
  },
  cacher: "Memory",
});

const serviceSchema = IAMServiceSchema({
  idp: {
  },
  oidc: {
    issuer: "http://0.0.0.0:8080",

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
  },
  server: {
    http: {
      hostname: "0.0.0.0",
      port: 8080,
    },
  },
});

broker.createService(serviceSchema);
broker.start();

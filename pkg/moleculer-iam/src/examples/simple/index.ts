"use strict";

import { ServiceBroker } from "moleculer";
import { app } from "./app";
import { IAMServiceSchema } from "../../"; // "moleculer-iam";

// import Renderer from "moleculer-iam-app-renderer";
// tslint:disable-next-line:no-var-requires to avoid circular deps in our monorepo workspace
const rendererFactory = require("moleculer-iam-interaction-renderer");

// can use any alternative renderer rather than this default one

// const testRendererAdapter: InteractionRendererAdapter<{test: number}> = {
//   render(state) {
//     console.log(state);
//     return JSON.stringify(state);
//   },
//   routes () {
//     return [];
//   },
// };

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
        // custom: {
        //   clientID: "XXX",
        //   clientSecret: "YYY",
        //   callback: ({ accessToken, refreshToken, profile, idp, logger }) => {
        //     throw new Error("not implemented");
        //   },
        //   scope: "openid",
        //   strategy: () => {
        //     throw new Error("not implemented");
        //   },
        // },
      },
      renderer: {
        // factory: require("moleculer-iam-interaction-renderer"), // this is default behavior
        options: {
          logo: {
            uri: "https://upload.wikimedia.org/wikipedia/commons/a/a2/OpenID_logo_2.svg",
            align: "left",
          },
          login: {
            federationOptionsVisibleDefault: false,
          },
          theme: {
            palette: {
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
    app,
    http: {
      hostname: "localhost",
      port: 9090,
    },
  },
});

broker.createService(serviceSchema);
broker.start();

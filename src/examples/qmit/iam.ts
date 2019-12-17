import { ServiceBroker } from "moleculer";
import { createBrokerOptions } from "moleculer-qmit";
import { IAMServiceSchema } from "../../";
import { config } from "./config";

export const {isDebug, isDev} = config;

// create service broker
export const broker = new ServiceBroker(createBrokerOptions({
  logLevel: isDebug ? "debug" : "info",
}));

// create IAM service
broker.createService(
  IAMServiceSchema({
    idp: {
      claims: {
        mandatoryScopes: [
          "openid",
          "profile",
          "email",
          "phone",
        ],
      },
    },
    oidc: {
      app: {
        isValidPath: path => path === "/" || path === "/help" || path.startsWith("/help/"),
      },
      devMode: isDev,
      issuer: isDev ? "https://account.dev.qmit.pro" : "https://account.qmit.pro",
      op_policy_uri: isDev ? "https://account.dev.qmit.pro/help/policy" : "https://account.qmit.pro/help/policy",
      op_tos_uri: isDev ? "https://account.dev.qmit.pro/help/tos" : "https://account.qmit.pro/help/tos",
      service_documentation: isDev ? "https://account.dev.qmit.pro/help" : "https://account.qmit.pro/help",
      ...config.oidc,
    },
    server: {
      http: {
        hostname: "0.0.0.0",
        port: 8080,
      },
    },
  }),
);

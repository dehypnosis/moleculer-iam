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
    idp: {},
    oidc: {
      app: {
        isValidPath: path => path === "/" || path === "/my" || path.startsWith("/my/"),
      },
      issuer: isDev ? "https://account.dev.qmit.pro" : "https://account.qmit.pro",
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

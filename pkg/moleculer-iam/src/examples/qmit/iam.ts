import * as _ from "lodash";
import { ServiceBroker } from "moleculer";
import { moleculer } from "qmit-sdk";
import { IAMServiceSchema, IAMServiceSchemaOptions } from "../../";
import { config } from "./config";
import { app } from "./app";

export const {isDebug, isDev} = config;

// create service broker
export const broker = new ServiceBroker(moleculer.createServiceBrokerOptions({
  logLevel: isDebug ? "debug" : "info",
}));

// create IAM service
broker.createService(
  IAMServiceSchema(_.defaultsDeep({
    idp: {
      claims: {
        mandatoryScopes: [
          "openid",
          "profile",
          "email",
          // "phone",
          "impersonation",
        ],
      },
    },
    op: {
      dev: isDev,
      issuer: isDev ? "https://account.dev.qmit.pro" : "https://account.qmit.pro",
      discovery: {
        op_policy_uri: isDev ? "https://account.dev.qmit.pro/help/policy" : "https://account.qmit.pro/help/policy",
        op_tos_uri: isDev ? "https://account.dev.qmit.pro/help/tos" : "https://account.qmit.pro/help/tos",
        service_documentation: isDev ? "https://account.dev.qmit.pro/help" : "https://account.qmit.pro/help",
      },
      app: {
        renderer: {
          options: {
            register: {
              skipEmailVerification: true,
              skipPhoneVerification: false,
            },
          },
        },
        verifyEmail: {
          async send({logger, ...args}) {
            logger.info(args);
          },
        },
        verifyPhone: {
          async send({logger, ...args}) {
            logger.info(args);
          },
        },
      },
    },
    server: {
      app,
      http: {
        hostname: "0.0.0.0",
        port: 9090,
      },
    },
  } as IAMServiceSchemaOptions, config.iam)),
);

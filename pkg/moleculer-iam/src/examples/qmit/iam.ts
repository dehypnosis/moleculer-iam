import * as _ from "lodash";
import { ServiceBroker } from "moleculer";
import { moleculer } from "qmit-sdk";
import { IAMServiceSchema, IAMServiceSchemaOptions } from "../../";
import { config } from "./config";
import { app } from "./app";

export const {isDebug, isDev, issuer, apiGatewayEndpoint} = config;

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
      issuer,
      discovery: {
        op_policy_uri: `${issuer}/help/policy`,
        op_tos_uri: `${issuer}/help/tos`,
        service_documentation: `${issuer}/help`,
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

            try {
              await broker.call("sports.notification.sendVerificationEmail", args);
            } catch (err) {
              logger.error(err);
            }
          },
        },
        verifyPhone: {
          async send({logger, ...args}) {
            logger.info(args);

            try {
              await broker.call("sports.notification.sendVerificationSMS", args);
            } catch (err) {
              logger.error(err);
            }
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
    apiGatewayEndpoint,
  } as IAMServiceSchemaOptions, config.iam)),
);

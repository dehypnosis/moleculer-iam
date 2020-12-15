import * as _ from "lodash";
import { ServiceBroker } from "moleculer";
import { moleculer } from "qmit-sdk";
import { IAMServiceSchema, IAMServiceSchemaOptions } from "../../";
import { config } from "./config";
import env from "./env";
import { app } from "./app";

export const {isDebug, isDev, issuer, apiGatewayEndpoint} = config;
const { APPLE_AUTH_ENV} = env;
// create service broker
export const broker = new ServiceBroker(moleculer.createServiceBrokerOptions({
  logLevel: isDebug ? "debug" : "info",
}));

// * dev endpoint for login: http://localhost:9090/op/auth?prompt=login&response_type=code&client_id=api-gateway&redirect_uri=https://api.dev.qmit.pro/iam/login/callback&scope=openid

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
            login: {
              federationOptionsVisible: true,
            },
          },
        },
        federation: {
          apple:  {
            clientID: APPLE_AUTH_ENV.CLIENT_ID!,
            teamID: APPLE_AUTH_ENV.TEAM_ID,
            keyID: APPLE_AUTH_ENV.KEY_ID,
            // callbackURL: APPLE_AUTH_ENV.CALLBACK_URL,
            privateKeyString: APPLE_AUTH_ENV.PRIVATE_KEY_STRING,
          }
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

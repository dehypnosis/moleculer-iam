"use strict";

import { ServiceBroker } from "moleculer";
import { IAMServiceSchema } from "../service";
import { doCommonServiceTest } from "./service.spec.common";

const env = (name: string, fallback: any) => {
  const value = process.env[name];
  return typeof value === "undefined" ? fallback : value;
};

const adapter = {
  type: "RDBMS" as any,
  options: {
    dialect: env("TEST_RDBMS_DIALECT", "mysql"),
    host: env("TEST_RDBMS_HOST", "mysql-dev.internal.qmit.pro"),
    database: env("TEST_RDBMS_DATABASE", "iam"),
    username: env("TEST_RDBMS_USERNAME", "iam"),
    password: env("TEST_RDBMS_PASSWORD", "iam"),
    sqlLogLevel: env("TEST_RDBMS_LOG_LEVEL", "none"),
  },
};

const broker = new ServiceBroker({logLevel: "error"});
const service = broker.createService(
  IAMServiceSchema({
    idp: {
      adapter,
    },
    oidc: {
      issuer: "http://localhost:8899",
      adapter,
    },
    server: {
      http: {
        hostname: "localhost",
        port: 8899,
      },
    },
  }),
);

jest.setTimeout(1000*60*4);

doCommonServiceTest(broker, service);

"use strict";

import { ServiceBroker } from "moleculer";
import { IAMServiceSchema } from "../service";
import { doCommonServiceTest } from "./service.spec.common";

const env = (name: string, fallback: any) => {
  const value = process.env[name];
  return typeof value === "undefined" ? fallback : value;
};

const adapter = {
  type: "Memory" as any,
  options: {
  },
};

const broker = new ServiceBroker({logLevel: "error"});
const service = broker.createService(
  IAMServiceSchema({
    idp: {
      adapter,
    },
    op: {
      issuer: "http://localhost:8898",
      adapter,
    },
    server: {
      http: {
        hostname: "localhost",
        port: 8898,
      },
    },
  }),
);

jest.setTimeout(1000*60*4);

doCommonServiceTest(broker, service);

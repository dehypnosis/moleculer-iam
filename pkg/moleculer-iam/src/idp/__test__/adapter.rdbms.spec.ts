import { IdentityProvider } from "../idp";
import { doCommonAdapterTest } from "./adapter.spec.common";

const env = (name: string, fallback: any) => {
  const value = process.env[name];
  return typeof value === "undefined" ? fallback : value;
};

const idp = new IdentityProvider({
  logger: console,
}, {
  adapter: {
    type: "RDBMS",
    options: {
      dialect: env("TEST_RDBMS_DIALECT", "mysql"),
      host: env("TEST_RDBMS_HOST", "mysql-dev.internal.qmit.pro"),
      database: env("TEST_RDBMS_DATABASE", "iam"),
      username: env("TEST_RDBMS_USERNAME", "iam"),
      password: env("TEST_RDBMS_PASSWORD", "iam"),
      sqlLogLevel: env("TEST_RDBMS_LOG_LEVEL", "none"),
    },
  },
});

jest.setTimeout(1000*60*4);

doCommonAdapterTest(idp);

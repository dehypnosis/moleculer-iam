import { IdentityProvider } from "../provider";
import { doCommonAdapterTest } from "./adapter.spec.common";

const idp = new IdentityProvider({
  logger: console,
}, {
  adapter: {
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
});

doCommonAdapterTest(idp);

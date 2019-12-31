import { IdentityProvider } from "../provider";
import { doCommonAdapterTest } from "./adapter.spec.common";

const isTravis = !!process.env.TRAVIS;

const idp = new IdentityProvider({
  logger: console,
}, {
  adapter: {
    type: "RDBMS",
    options: {
      dialect: "mysql",
      host: isTravis ? "127.0.0.1" : "mysql-dev.internal.qmit.pro",
      database: "iam",
      username: isTravis ? "travis" : "iam",
      password: isTravis ? undefined : "iam",
      sqlLogLevel: "none",
    },
  },
});

jest.setTimeout(1000*60*4);

doCommonAdapterTest(idp);

import { IdentityProvider } from "../idp";
import { doCommonAdapterTest } from "./adapter.spec.common";

const idp = new IdentityProvider({
  logger: console,
}, {
  adapter: {
    type: "Memory",
    options: {},
  },
});

doCommonAdapterTest(idp);

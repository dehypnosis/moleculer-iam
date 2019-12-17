import { IdentityProvider } from "../provider";
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

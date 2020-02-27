import Router from "koa-router";
import { OIDCProvider } from "../../oidc/provider";

export const app = async (oidc: OIDCProvider) => {
  const router = new Router({
    sensitive: false,
    strict: false,
  });

  // ... nothing

  return router.routes();
};

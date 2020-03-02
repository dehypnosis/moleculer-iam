import Router from "koa-router";
import { OIDCProvider } from "../../op";

export const app = async (op: OIDCProvider) => {
  const router = new Router({
    sensitive: false,
    strict: false,
  });

  // ... nothing

  return router.routes();
};

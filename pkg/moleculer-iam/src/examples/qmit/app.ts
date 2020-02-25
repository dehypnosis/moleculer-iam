import Router from "koa-router";
import { OIDCProvider } from "../../oidc/provider";

export const app = async (oidc: OIDCProvider) => {
  const router = new Router({
    sensitive: false,
    strict: false,
  });

  router.get("/", (ctx, next) => {
    ctx.body = `<html><body>Any optional application routes can be mapped except reserved ones:<pre>${JSON.stringify(oidc.defaultRoutes, null, 2)}</pre></body></html>`;
  });

  return router.routes();
};

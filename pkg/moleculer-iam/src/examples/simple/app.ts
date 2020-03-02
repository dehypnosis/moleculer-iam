import Router from "koa-router";
import { OIDCProvider } from "../../"; // "moleculer-iam";

export const app = async (op: OIDCProvider) => {
  const router = new Router({
    sensitive: false,
    strict: false,
  });

  // TODO: remove creating default client and make upsertClient method and do that here

  // router.get("/", (ctx, next) => {
  //   ctx.body = `<html><body>Any optional application routes can be mapped except reserved ones, or just let be not found:<pre>${JSON.stringify(oidc.defaultRoutes, null, 2)}</pre></body></html>`;
  // });

  return router.routes();
};

import Router from "koa-router";
import { OIDCProvider } from "../../oidc/provider";

export const app = async (oidc: OIDCProvider) => {
  // create client for SPA
  const {issuer, devModeEnabled} = oidc;
  await oidc.createClient({
    client_id: issuer.replace("https://", "").replace("http://", "").replace(":", "-"),
    client_name: "Account Manager",
    client_uri: issuer,
    application_type: "web" as "web",
    policy_uri: `${issuer}/help/policy`,
    tos_uri: `${issuer}/help/tos`,
    logo_uri: undefined,
    redirect_uris: [...new Set([issuer].concat(devModeEnabled ? ["http://localhost:9191", "http://localhost:9090", "http://localhost:8080", "http://localhost:3000"] : []))],
    post_logout_redirect_uris: [issuer],
    frontchannel_logout_uri: `${issuer}`,
    frontchannel_logout_session_required: true,
    grant_types: ["implicit", "authorization_code", "refresh_token"],
    response_types: ["code", "id_token", "id_token token", "code id_token", "code token", "code id_token token", "none"],
    token_endpoint_auth_method: "none",

    /* custom props */
    skip_consent: true,
  });

  const router = new Router({
    sensitive: false,
    strict: false,
  });

  router.get("/", (ctx, next) => {
    ctx.body = `<html><body>Any optional application routes can be mapped except reserved ones:<pre>${JSON.stringify(oidc.defaultRoutes, null, 2)}</pre></body></html>`;
  });

  return router.routes();
};

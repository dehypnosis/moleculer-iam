import * as _ from "lodash";
import { KoaContextWithOIDC } from "../../provider";
import { ClientApplicationContext, ClientApplicationProps, render } from "../render";
import { getPublicClientProps } from "../util";

export const renderInternalFlow = (ctx: any, props: Omit<ClientApplicationProps, "context">) => {
  ctx = ctx as KoaContextWithOIDC;
  const oidc = (ctx.oidc || {}) as typeof ctx.state.oidc;
  const {route = null, client = null, session = null, params} = oidc;

  // get prompt context
  const context: ClientApplicationContext = {
    account_id: session && session.account || null,
    client: getPublicClientProps(client),
    prompt: {
      name: route,
      details: {},
      reasons: [],
    },
    params: _.mapValues(params || {}, value => typeof value === "undefined" ? null : value),
  };

  // fill XSRF token for POST actions
  const xsrf = oidc.session && oidc.session.state && oidc.session.state.secret || undefined;
  if (xsrf) {
    // tslint:disable-next-line:forin
    for (const k in props.action) {
      const action = props.action[k];
      if (action.method === "POST") {
        action.data.xsrf = xsrf;
      }
    }
  }

  render(ctx, {
    ...props,
    context,
  });
};

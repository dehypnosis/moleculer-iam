import { UserInteractionConfiguration } from "../index";
import { renderInternalFlow } from "./render";

// signed out without post_logout_redirect_uri params
export const postLogoutSuccessSource: UserInteractionConfiguration["postLogoutSuccessSource"] = (ctx) => {
  // const oidc = ctx.oidc as typeof ctx.state.oidc;
  renderInternalFlow(ctx, {});
};

// sign out
// ref: https://github.com/panva/node-oidc-provider/blob/c6b1770e68224b7463c1fa5c64199f0cd38131af/lib/actions/end_session.js#L88
export const logoutSource: UserInteractionConfiguration["logoutSource"] = (ctx, formHTML) => {
  const oidc = ctx.oidc as typeof ctx.state.oidc;
  renderInternalFlow(ctx, {
    action: {
      confirm: {
        url: (oidc as any).urlFor("end_session_confirm"),
        method: "POST",
        data: {
          logout: true,
        },
      },
    },
  });
};

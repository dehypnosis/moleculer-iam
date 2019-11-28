import { UserInteractionDeviceFlowConfiguration } from "../index";
import { renderInternalFlow } from "./render";

// prompt user code for device flow
// ref: https://github.com/panva/node-oidc-provider/blob/74b434c627248c82ca9db5aed3a03f0acd0d7214/lib/actions/code_verification.js#L19
export const userCodeInputSource: UserInteractionDeviceFlowConfiguration["userCodeInputSource"] = (ctx, formHTML, out, err) => {
  const oidc = ctx.oidc as typeof ctx.state.oidc;
  renderInternalFlow(ctx, {
    action: {
      verify: {
        url: (oidc as any).urlFor("code_verification"),
        method: "POST",
        data: {
          user_code: oidc.params!.user_code || "",
        },
      },
    },
    error: out,
  });
};

// confirm user code
// ref: https://github.com/panva/node-oidc-provider/blob/master/lib/helpers/defaults.js#L635
export const userCodeConfirmSource: UserInteractionDeviceFlowConfiguration["userCodeConfirmSource"] = (ctx, form, client, deviceInfo, userCode) => { // eslint-disable-line no-unused-vars
  const oidc = ctx.oidc as typeof ctx.state.oidc;
  renderInternalFlow(ctx, {
    data: {
      deviceInfo,
    },
    action: {
      confirm: {
        url: (oidc as any).urlFor("code_verification"),
        method: "POST",
        data: {
          user_code: userCode,
          confirm: true,
        },
      },
      abort: {
        url: (oidc as any).urlFor("code_verification"),
        method: "POST",
        data: {
          user_code: userCode,
          abort: true,
        },
      },
    },
  });
};

export const successSource: UserInteractionDeviceFlowConfiguration["successSource"] = (ctx) => {
  renderInternalFlow(ctx, {});
};

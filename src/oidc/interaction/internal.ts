import * as _ from "lodash";
import { Logger } from "../../logger";
import { Configuration, KoaContextWithOIDC } from "../provider";
import { ClientApplicationContext, ClientApplicationProps, ClientApplicationRenderer } from "./render";
import { getPublicClientProps } from "./util";

export type InternalInteractionConfigurationFactoryProps = {
  renderer: ClientApplicationRenderer;
  logger: Logger;
};

export type InternalInteractionConfigurationKeys = "renderError" | "logoutSource" | "postLogoutSuccessSource";
export type InternalInteractionDeviceFlowConfigurationKeys = "userCodeInputSource" | "userCodeConfirmSource" | "successSource";
export type InternalInteractionDeviceFlowConfiguration = Required<Required<Configuration>["features"]>["deviceFlow"];
export type InternalInteractionConfiguration = {
  [key in InternalInteractionConfigurationKeys]: Configuration[key];
} & {
  features: {
    deviceFlow: { [key in InternalInteractionDeviceFlowConfigurationKeys]: InternalInteractionDeviceFlowConfiguration[key]; };
  };
};

export class InternalInteractionConfigurationFactory {
  constructor(protected readonly props: InternalInteractionConfigurationFactoryProps) {
  }

  public configuration(): InternalInteractionConfiguration {
    const render = this.render.bind(this);
    const logger = this.props.logger;
    return {
      /* error */
      renderError(ctx, out, error) {
        // @ts-ignore
        ctx.status = error.status || error.statusCode || 500;

        // @ts-ignore
        if (!error.expose) {
          logger.error(error);
        }

        return render(ctx, {
          error: out,
        });
      },

      /* logout */
      // signed out without post_logout_redirect_uri params
      postLogoutSuccessSource(ctx) {
        // const oidc = ctx.oidc as typeof ctx.state.oidc;
        return render(ctx, {});
      },

      // sign out
      // ref: https://github.com/panva/node-oidc-provider/blob/c6b1770e68224b7463c1fa5c64199f0cd38131af/lib/actions/end_session.js#L88
      logoutSource(ctx, formHTML) {
        const oidc = ctx.oidc as typeof ctx.state.oidc;
        return render(ctx, {
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
      },

      features: {
        deviceFlow: {
          /* device flow */
          // prompt user code for device flow
          // ref: https://github.com/panva/node-oidc-provider/blob/74b434c627248c82ca9db5aed3a03f0acd0d7214/lib/actions/code_verification.js#L19
          userCodeInputSource(ctx, formHTML, out, err) {
            const oidc = ctx.oidc as typeof ctx.state.oidc;
            return render(ctx, {
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
          },

          // confirm user code
          // ref: https://github.com/panva/node-oidc-provider/blob/master/lib/helpers/defaults.js#L635
          userCodeConfirmSource(ctx, form, client, deviceInfo, userCode) { // eslint-disable-line no-unused-vars
            const oidc = ctx.oidc as typeof ctx.state.oidc;
            return render(ctx, {
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
          },

          // user code confirmed
          successSource(ctx) {
            return render(ctx, {});
          },
        },
      },
    };
  }

  private render(ctx: any, props: Omit<ClientApplicationProps, "context">) {
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

    return this.props.renderer.render(ctx, {
      ...props,
      context,
    });
  }
}

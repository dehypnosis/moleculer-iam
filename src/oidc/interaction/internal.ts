// import * as _ from "lodash";
import { Logger } from "../../logger";
import { Configuration, KoaContextWithOIDC, OIDCErrors } from "../provider";
import { ClientApplicationError, ClientApplicationProps, ClientApplicationRenderer } from "./render";
import { RouterContext } from "koa-router";
import { IdentityProvider } from "../../identity";
import { getPublicClientProps } from "./util";
// import { getPublicClientProps } from "./util";

export type InternalInteractionConfigurationFactoryProps = {
  idp: IdentityProvider;
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
    const idp = this.props.idp;
    const render = this.render.bind(this);
    const logger = this.props.logger;
    return {
      /* error */
      async renderError(ctx, out, error) {
        await render(ctx, {
          error,
        });
      },

      /* logout */
      // signed out without post_logout_redirect_uri params
      async postLogoutSuccessSource(ctx) {
        const oidc = ctx.oidc as typeof ctx.state.oidc;
        await render(ctx, {
          interaction: {
            name: "logout_end",
          },
        });
      },

      // sign out
      // ref: https://github.com/panva/node-oidc-provider/blob/c6b1770e68224b7463c1fa5c64199f0cd38131af/lib/actions/end_session.js#L88
      async logoutSource(ctx, formHTML) {
        const oidc = ctx.oidc as typeof ctx.state.oidc;
        const id = await idp.find(oidc.session!.accountId() as string);
        ctx.assert(id);
        const clientId = oidc.session!.state!.clientId;
        const client = clientId ? (await oidc.provider.Client.find(clientId)) : null;

        const {email, preferred_username, nickname, name} = await id.claims("id_token", "profile email");
        await render(ctx, {
          interaction: {
            name: "logout",
            action: {
              submit: {
                url: (oidc as any).urlFor("end_session_confirm"),
                method: "POST",
                data: {
                  logout: true,
                },
              },
            },
            data: {
              email,
              name: preferred_username || nickname || name,
              client: getPublicClientProps(client as any),
            },
          },
        });
      },

      features: {
        deviceFlow: {
          /* device flow */
          // prompt user code for device flow
          // ref: https://github.com/panva/node-oidc-provider/blob/74b434c627248c82ca9db5aed3a03f0acd0d7214/lib/actions/code_verification.js#L19
          async userCodeInputSource(ctx, formHTML, out, error) {
            const oidc = ctx.oidc as typeof ctx.state.oidc;
            await render(ctx, {
              error,
              interaction: {
                name: "device_flow_code_verification",
                action: {
                  submit: {
                    url: (oidc as any).urlFor("code_verification"),
                    method: "POST",
                    data: {
                      user_code: oidc.params!.user_code || "",
                    },
                  },
                },
              },
            });
          },

          // confirm user code
          // ref: https://github.com/panva/node-oidc-provider/blob/master/lib/helpers/defaults.js#L635
          async userCodeConfirmSource(ctx, form, client, deviceInfo, userCode) { // eslint-disable-line no-unused-vars
            const oidc = ctx.oidc as typeof ctx.state.oidc;
            await render(ctx, {
              interaction: {
                name: "device_flow_confirm",
                data: {
                  deviceInfo,
                },
                action: {
                  submit: {
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
              },
            });
          },

          // user code confirmed
          async successSource(ctx) {
            await render(ctx, {
              interaction: {
                name: "device_flow_end",
                // TODO: add details for to determine confirmed or non-confirmed
              },
            });
          },
        },
      },
    };
  }

  private render(ctx: KoaContextWithOIDC | RouterContext, props: Omit<ClientApplicationProps, "error"> & { error?: any }) {
    ctx = ctx as KoaContextWithOIDC;
    const oidc = (ctx.oidc || {}) as typeof ctx.state.oidc;

    // const context: ClientApplicationContext = {
    //   account_id: session && session.account || null,
    //   client: getPublicClientProps(client),
    //   prompt: {
    //     name: route,
    //     details: {},
    //     reasons: [],
    //   },
    //   params: _.mapValues(params || {}, value => typeof value === "undefined" ? null : value),
    // };

    // fill XSRF token for POST actions
    if (props.interaction && props.interaction.action) {
      const xsrf = oidc.session && oidc.session.state && oidc.session.state.secret || undefined;
      if (xsrf) {
        // tslint:disable-next-line:forin
        for (const k in props.interaction.action) {
          const action = props.interaction.action[k];
          if (action.method === "POST") {
            action.data.xsrf = xsrf;
          }
        }
      }
    }

    return this.props.renderer.render(ctx, props);
  }
}

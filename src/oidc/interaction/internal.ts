import { Logger } from "../../logger";
import { Configuration, KoaContextWithOIDC } from "../provider";
import { ClientApplicationProps, ClientApplicationRenderer } from "./app";
import { RouterContext } from "koa-router";
import { Identity, IdentityProvider } from "../../identity";
import { getPublicClientProps, getPublicUserProps } from "./util";

export type InternalInteractionConfigurationFactoryProps = {
  idp: IdentityProvider;
  app: ClientApplicationRenderer;
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

    async function getContext(ctx: KoaContextWithOIDC) {
      const oidc = ctx.oidc as typeof ctx.state.oidc;

      // fetch identity and client
      const user = oidc.session ? await idp.findOrFail({ id: oidc.session!.accountId() as string }) : undefined;
      const clientId = oidc.session!.state!.clientId;
      const client = clientId ? (await oidc.provider.Client.find(clientId)) : undefined;
      return { user, client };
    }

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
        const { user, client } = await getContext(ctx);
        ctx.assert(user);

        await render(ctx, {
          interaction: {
            name: "logout",
            action: {
              submit: {
                url: ctx.oidc.urlFor("end_session_confirm"),
                method: "POST",
                data: {
                  logout: true,
                },
                urlencoded: true,
              },
            },
            data: {
              user: user ? await getPublicUserProps(user) : undefined,
              client: client ? await getPublicClientProps(client) : undefined,
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
            const { user, client } = await getContext(ctx);
            ctx.assert(user && client);

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
                data: {
                  user: user ? await getPublicUserProps(user) : undefined,
                  client: client ? await getPublicClientProps(client) : undefined,
                },
              },
            });
          },

          // confirm user code
          // ref: https://github.com/panva/node-oidc-provider/blob/master/lib/helpers/defaults.js#L635
          async userCodeConfirmSource(ctx, form, client, deviceInfo, userCode) { // eslint-disable-line no-unused-vars
            const { user } = await getContext(ctx);
            ctx.assert(user && client);

            const oidc = ctx.oidc as typeof ctx.state.oidc;

            await render(ctx, {
              interaction: {
                name: "device_flow_confirm",
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
                data: {
                  user: user ? await getPublicUserProps(user) : undefined,
                  client: client ? await getPublicClientProps(client) : undefined,
                  deviceInfo,
                },
              },
            });
          },

          // user code confirmed
          async successSource(ctx) {
            const { user, client } = await getContext(ctx);
            ctx.assert(user && client);

            await render(ctx, {
              interaction: {
                name: "device_flow_end",
                // TODO: add details for to determine confirmed or non-confirmed
                data: {
                  user: user ? await getPublicUserProps(user) : undefined,
                  client: client ? await getPublicClientProps(client) : undefined,
                },
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

    // fill XSRF token
    if (props.interaction && props.interaction.action) {
      const xsrf = oidc.session && oidc.session.state && oidc.session.state.secret || undefined;
      if (xsrf) {
        // tslint:disable-next-line:forin
        for (const k in props.interaction.action) {
          const action = props.interaction.action[k];
          action.data.xsrf = xsrf;
        }
      }
    }

    return this.props.app.render(ctx, props);
  }
}

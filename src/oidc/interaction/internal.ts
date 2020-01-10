import { Logger } from "../../logger";
import { Configuration, KoaContextWithOIDC } from "../provider";
import { RouterContext } from "koa-router";
import { IdentityProvider } from "../../identity";
import { getPublicClientProps, getPublicUserProps } from "./util";

export type InternalInteractionConfigurationFactoryProps = {
  idp: IdentityProvider;
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
    const logger = this.props.logger;
    const render = this.render.bind(this);

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
        logger.error(error);
        ctx.type = "json";
        ctx.body = out;
      },

      /* logout */
      // signed out without post_logout_redirect_uri params
      async postLogoutSuccessSource(ctx) {
        ctx.type = "json";
        ctx.body = null;
      },

      // sign out
      // ref: https://github.com/panva/node-oidc-provider/blob/c6b1770e68224b7463c1fa5c64199f0cd38131af/lib/actions/end_session.js#L88
      async logoutSource(ctx, formHTML) {
        const { user, client } = await getContext(ctx);
        ctx.assert(user);

        await render(ctx, {
          interaction: "logout",
          data: {
            user: user ? await getPublicUserProps(user) : undefined,
            client: client ? await getPublicClientProps(client) : undefined,
          },
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

            await render(ctx, error || {
              error,
              interaction: "device_code_verification",
              data: {
                user: user ? await getPublicUserProps(user) : undefined,
                client: client ? await getPublicClientProps(client) : undefined,
              },
              action: {
                submit: {
                  url: (oidc as any).urlFor("code_verification"),
                  method: "POST",
                  data: {
                    user_code: oidc.params!.user_code || "",
                  },
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
              interaction: "device_code_verification_end",
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
            });
          },

          // user code confirmed
          async successSource(ctx) {
            const { user, client } = await getContext(ctx);
            ctx.assert(user && client);

            await render(ctx, {
              interaction: "device_code_verification_complete",
              // TODO: add details for to determine confirmed or non-confirmed
              data: {
                user: user ? await getPublicUserProps(user) : undefined,
                client: client ? await getPublicClientProps(client) : undefined,
              },
            });
          },
        },
      },
    };
  }

  private render(ctx: KoaContextWithOIDC | RouterContext, props: any) {
    // fill XSRF token
    if (props && props.action) {
      ctx = ctx as KoaContextWithOIDC;
      const oidc = (ctx.oidc || {}) as typeof ctx.state.oidc;
      const xsrf = oidc.session && oidc.session.state && oidc.session.state.secret || undefined;
      if (xsrf) {
        // tslint:disable-next-line:forin
        for (const k in props.action) {
          const action = props.action[k];
          (action.data = action.data || {}).xsrf = xsrf;
        }
      }
    }

    ctx.type = "json";
    ctx.body = props;
  }
}

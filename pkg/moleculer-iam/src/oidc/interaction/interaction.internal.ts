import { Configuration, KoaContextWithOIDC } from "oidc-provider";
import { Logger } from "../../logger";
import { IdentityProvider } from "../../identity";
import { getPublicClientProps, getPublicUserProps } from "./util"; // TODO
import { InteractionRenderer } from "./interaction.render";

// @ts-ignore : need to hack oidc-provider private methods
import getProviderHiddenProps from "oidc-provider/lib/helpers/weak_cache";

export type InternalInteractionConfigurationFactoryProps = {
  idp: IdentityProvider;
  logger: Logger;
  renderer: InteractionRenderer;
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
      async renderError(ctx, out, error) {
        logger.error(error);
        render(ctx, { error: out });
      },

      // signed out without post_logout_redirect_uri params
      async postLogoutSuccessSource(ctx) {
        return render(ctx, {
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
            actions: {
              submit: {
                url: ctx.oidc.urlFor("end_session_confirm"),
                method: "POST",
                payload: {
                  logout: true,
                },
                urlencoded: true,
              },
            },
            data: {
              user,
              client,
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

            await render(ctx, {
              error,
              interaction: error ? undefined : {
                name: "device_code_verification",
                data: {
                  user,
                  client,
                },
                actions: {
                  submit: {
                    url: ctx.oidc.urlFor("code_verification"),
                    method: "POST",
                    payload: {
                      user_code: ctx.oidc.params!.user_code || "",
                    },
                  },
                },
              },
            });
          },

          // confirm user code
          // ref: https://github.com/panva/node-oidc-provider/blob/master/lib/helpers/defaults.js#L635
          // tslint:disable-next-line:variable-name
          async userCodeConfirmSource(ctx, form, client, device, user_code) { // eslint-disable-line no-unused-vars
            const { user } = await getContext(ctx);
            ctx.assert(user && client);

            await render(ctx, {
              interaction: {
                name: "device_code_verification_confirm",
                actions: {
                  submit: {
                    url: ctx.oidc.urlFor("code_verification"),
                    method: "POST",
                    payload: {
                      user_code,
                      confirm: true,
                    },
                  },
                  abort: {
                    url: ctx.oidc.urlFor("code_verification"),
                    method: "POST",
                    payload: {
                      user_code,
                      abort: true,
                    },
                  },
                },
                data: {
                  user,
                  client,
                  device,
                },
              }
            });
          },

          // user code confirmed
          async successSource(ctx) {
            const { user, client } = await getContext(ctx);
            ctx.assert(user && client);

            await render(ctx, {
              interaction: {
                name: "device_code_verification_end",
                // TODO: add details for to determine confirmed or non-confirmed
                data: {
                  user,
                  client,
                },
              },
            });
          },
        },
      },
    };
  }

  private render: InteractionRenderer["render"] = (ctx, props) => {
    ctx = ctx as KoaContextWithOIDC;
    const oidc = (ctx.oidc || {}) as typeof ctx.state.oidc;

    // fill XSRF token
    if (props && props.interaction) {
      const xsrf = oidc.session && oidc.session.state && oidc.session.state.secret || undefined;
      if (xsrf) {
        // tslint:disable-next-line:forin
        for (const k in props.interaction.actions) {
          const action = props.interaction.actions[k];
          (action.payload = action.payload || {}).xsrf = xsrf;
        }
      }
    }

    // get metadata
    const metadata = oidc.provider && getProviderHiddenProps(oidc.provider).configuration().discovery || {};

    return this.props.renderer.render(ctx, {metadata, ...props});
  }
}

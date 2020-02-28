import * as _ from "lodash";
import { Configuration, KoaContextWithOIDC } from "../provider";
import { Logger } from "../../logger";
import { Identity, IdentityProvider } from "../../identity";
import { normalizeError } from "./interaction.error";
import { getPublicClientProps, getPublicUserProps } from "./util";
import { InteractionRenderer } from "./interaction.render";

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
        logger.error("internal error", error);
        return render(ctx, { error: out });
      },

      // signed out without post_logout_redirect_uri params
      async postLogoutSuccessSource(ctx) {

        let user: Identity|undefined;
        try {
          const session = await ctx.oidc.provider.Session.get(ctx);
          if (typeof session.account === "string") {
            user = await idp.findOrFail({ id: session.account });
          }
        } catch {
        }

        return render(ctx, {
          interaction: {
            name: "logout",
            data: {
              user: await getPublicUserProps(user),
            },
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
            data: {
              user: await getPublicUserProps(user),
              client: await getPublicClientProps(client),
            },
            actions: {
              // destroy sessions
              "logout.confirm": {
                url: ctx.oidc.urlFor("end_session_confirm"),
                method: "POST",
                payload: {
                  logout: "true",
                },
                urlencoded: true,
              },
              // without session destroy
              "logout.redirect": {
                url: ctx.oidc.urlFor("end_session_confirm"),
                method: "POST",
                urlencoded: true,
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
          async userCodeInputSource(ctx, formHTML, out, error) {
            const { user, client } = await getContext(ctx);
            ctx.assert(user && client);

            await render(ctx, {
              error: out,
              interaction: out ? undefined : {
                name: "device_code_verification",
                data: {
                  user: await getPublicUserProps(user),
                  client: await getPublicClientProps(client),
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
                name: "device_code_verification",
                data: {
                  user: await getPublicUserProps(user),
                  client: await getPublicClientProps(client),
                  device,
                },
                actions: {
                  verify: {
                    url: ctx.oidc.urlFor("code_verification"),
                    method: "POST",
                    payload: {
                      user_code,
                      confirm: "true",
                    },
                  },
                  abort: {
                    url: ctx.oidc.urlFor("code_verification"),
                    method: "POST",
                    payload: {
                      user_code,
                      abort: "true",
                    },
                  },
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
                name: "device_code_verification",
                // TODO: add details for to determine confirmed or non-confirmed
                data: {
                  user: await getPublicUserProps(user),
                  client: await getPublicClientProps(client),
                },
              },
            });
          },
        },
      },
    };
  }

  private render: InteractionRenderer["render"] = (ctx, state) => {
    ctx = ctx as KoaContextWithOIDC;
    const oidc = (ctx.oidc || {}) as typeof ctx.state.oidc;

    // fill XSRF token
    if (state && state.interaction) {
      const xsrf = oidc.session && oidc.session.state && oidc.session.state.secret || undefined;
      if (xsrf) {
        state.interaction.actions = _.cloneDeep(state.interaction.actions);

        // tslint:disable-next-line:forin
        for (const k in state.interaction.actions) {
          const action = state.interaction.actions[k];
          action.payload = action.payload || {};
          action.payload.xsrf = xsrf;
        }
      }
    }

    return this.props.renderer.render(ctx, state);
  }
}

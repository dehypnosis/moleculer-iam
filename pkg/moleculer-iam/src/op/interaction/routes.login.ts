import { Errors } from "../../idp";
import { ProviderConfigBuilder } from "../proxy";
import { InteractionBuildOptions } from "./bootstrap";
import { InteractionActionEndpointGroups } from "./routes";

export function buildLoginRoutes(builder: ProviderConfigBuilder, opts: InteractionBuildOptions, actions: InteractionActionEndpointGroups): void {
  builder.interaction.router
    .get("/login", async ctx => {
      const { user, interaction, setInteractionResult, render, data, url } = ctx.op;
      ctx.assert(interaction);

      // already signed in and consent interaction
      if (user) {
        const changeAccount = ctx.query.change_account === "true" || interaction!.params.change_account === "true";
        const resume = !changeAccount && interaction!.prompt.name !== "login";
        if (resume) {
          const redirect = await setInteractionResult!({
            login: {
              account: user.id,
              remember: true,
            },
          });
          return render({ redirect });
        }

        // redirect to same page with signed in user's email hint
        if (!changeAccount && data.user && data.user.email && !ctx.query.email) {
          return render({
            redirect: url("/login") + `?email=${encodeURIComponent(data.user.email)}`,
          });
        }
      }

      return render({
        interaction: {
          name: "login",
          data,
          actions: actions.login,
        },
      });
    })

    // redirect to initial render page
    .get("/login/:any*", ctx => {
      return ctx.op.render({
        redirect: ctx.op.url("/login") + (ctx.search || ""),
      });
    })

    // check login email exists
    .post("/login/check_email", async ctx => {
      const {email} = ctx.request.body;
      const user = await ctx.idp.findOrFail({claims: {email: email || ""}});
      return ctx.body = {
        user: await builder.interaction.getPublicUserProps(user),
      };
    })

    // handle password login
    .post("/login/check_password", async ctx => {
      const { interaction, setInteractionResult, render } = ctx.op;
      ctx.assert(interaction);
      const {email, password} = ctx.request.body;

      // check account and password
      const user = await ctx.idp.findOrFail({claims: {email: email || ""}});
      if (!await user.assertCredentials({password: password || ""})) {
        throw new Errors.InvalidCredentialsError();
      }

      // finish interaction and give redirection uri
      const redirect = await setInteractionResult!({
        login: {
          account: user.id,
          remember: true,
        },
      });

      return render({
        redirect,
      });
    });
}

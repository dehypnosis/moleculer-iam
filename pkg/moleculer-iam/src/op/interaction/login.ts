import { Errors } from "../../idp";
import { ProviderConfigBuilder } from "../proxy";
import { InteractionBuildOptions } from "./index";
import { InteractionActionEndpointGroups } from "./actions";

export function buildLoginRoutes(builder: ProviderConfigBuilder, opts: InteractionBuildOptions, actions: InteractionActionEndpointGroups): void {
  builder.interaction.router// redirect to initial render page

    .get("/login/:any+", async ctx => {
      return ctx.op.redirect("login" + (ctx.search || ""));
    })

    // initial render page
    .get("/login", async ctx => {
      const { user, interaction, metadata } = ctx.op;
      ctx.op.assertPrompt();

      // already signed in and consent interaction
      if (user) {
        const changeAccount = ctx.query.change_account === "true" || interaction!.params.change_account === "true";
        const resume = !changeAccount && interaction!.prompt.name !== "login";
        if (resume) {
          return ctx.op.redirectWithUpdate({
            login: {
              account: user.id,
              remember: true,
            },
          });
        }

        // redirect to same page with signed in user's email hint
        if (!changeAccount && metadata.user && metadata.user.email && !ctx.query.email) {
          return ctx.op.redirect(`/login?email=${encodeURIComponent(metadata.user.email)}`);
        }
      }

      return ctx.op.render({
        name: "login",
        actions: actions.login,
      });
    })

    // check login email exists
    .post("/login/check_email", async ctx => {
      const user = await ctx.idp.findOrFail({claims: {email: ctx.request.body.email || ""}});

      // set login data to session state and response
      const userClaims = await builder.interaction.getPublicUserProps(user);
      await ctx.op.setSessionState(prevState => ({
        ...prevState,
        login: { user: userClaims },
      }));

      return ctx.op.end();
    })

    // handle password login
    .post("/login/check_password", async ctx => {
      ctx.op.assertPrompt();
      const {email, password} = ctx.request.body;

      // check account and password
      const user = await ctx.idp.findOrFail({claims: {email: email || ""}});
      if (!await user.assertCredentials({password: password || ""})) {
        throw new Errors.InvalidCredentialsError();
      }

      // clear login session state
      await ctx.op.setSessionState(prevState => ({
        ...prevState,
        login: undefined,
      }));

      // finish interaction and give redirection uri
      return ctx.op.redirectWithUpdate({
        login: {
          account: user.id,
          remember: true,
        },
      });
    });
}

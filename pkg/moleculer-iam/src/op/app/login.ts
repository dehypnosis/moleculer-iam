import { Errors } from "../../idp";
import { ProviderConfigBuilder } from "../proxy";
import { ApplicationBuildOptions } from "./index";
import { ApplicationActionEndpointGroups } from "./actions";

export function buildLoginRoutes(builder: ProviderConfigBuilder, opts: ApplicationBuildOptions, actions: ApplicationActionEndpointGroups): void {
  builder.app.router// redirect to initial render page

    .get("/login/:any+", async ctx => {
      return ctx.op.redirect("/login" + (ctx.search || ""));
    })

    // initial render page
    .get("/login", async ctx => {
      const { user, userClaims, interaction, metadata } = ctx.op;
      ctx.op.assertPrompt();

      // already signed in and consent app
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
        if (!changeAccount && userClaims && userClaims.email && !ctx.query.email) {
          return ctx.op.redirect(`/login?email=${encodeURIComponent(userClaims.email)}`);
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
      const userClaims = await ctx.op.getPublicUserProps(user);
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

      // finish app and give redirection uri
      return ctx.op.redirectWithUpdate({
        login: {
          account: user.id,
          remember: true,
        },
      });
    });
}

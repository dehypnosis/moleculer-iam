import { Errors } from "../../idp";
import { ProviderConfigBuilder } from "../proxy";
import { ApplicationBuildOptions } from "./index";

export function buildLoginRoutes(builder: ProviderConfigBuilder, opts: ApplicationBuildOptions): void {
  builder.app.router// redirect to initial render page

    // initial render page
    .get("/login", async (ctx, next) => {
      const { user, userClaims, interaction } = ctx.op;
      ctx.op.assertPrompt(["login", "consent"], "Login prompt session not exists.");

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

      // automatic federation
      const federate = ctx.query.federate || interaction!.params.federate;
      if (federate) {
        return builder.app.federation.handleRequest(ctx, next, federate);
      }

      return ctx.op.render("login");
    })

    // check login email exists
    .post("/login/check_email", async ctx => {
      const user = await ctx.idp.findOrFail({claims: {email: ctx.request.body.email || ""}});

      // set login data to session state and response
      const userClaims = await ctx.op.getPublicUserProps(user);
      ctx.op.setSessionPublicState(prevState => ({
        ...prevState,
        login: { user: userClaims },
      }));

      return ctx.op.end();
    })

    // handle password login
    .get("/login/check_password", async ctx => {
      if (!ctx.op.sessionPublicState.login) {
        return ctx.op.redirect("/login" + (ctx.search || ""));
      }
      return ctx.op.render("login");
    })
    .post("/login/check_password", async ctx => {
      ctx.op.assertPrompt();
      const {email, password} = ctx.request.body;

      // check account and password
      const user = await ctx.idp.findOrFail({claims: {email: email || ""}});
      if (!await user.assertCredentials({password: password || ""})) {
        throw new Errors.InvalidCredentialsError();
      }

      // clear login session state
      ctx.op.setSessionPublicState(prevState => ({
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

import { Errors } from "../../identity/error";
import { InteractionMiddleware, InteractionRequestContext } from "./interaction";
import { getPublicClientProps, getPublicUserProps } from "./util";

export const useLoginInteraction: InteractionMiddleware = ({ federation, provider, idp, url, render, router, parseContext }) => {
  // render login page
  router.get("/login", parseContext, async ctx => {
    const {user, client, interaction} = ctx.locals as InteractionRequestContext;

    // already signed in: login -> consent interaction
    const changeAccount = ctx.request.query.change_account === "true" || interaction.params.change_account === "true";
    const resume = !changeAccount && user && interaction.prompt.name !== "login";
    if (resume) {
      const login = {
        account: user!.id,
        remember: true,
      };

      const redirect = await provider.interactionResult(ctx.req, ctx.res, {
        ...interaction.result,
        login,
      }, {
        mergeWithLastSubmission: true,
      });

      // overwrite session
      await provider.setProviderSession(ctx.req, ctx.res, login);

      return render(ctx, {redirect});
    }

    return render(ctx, {
      interaction: {
        name: "login",
        data: {
          user: await getPublicUserProps(user),
          client: await getPublicClientProps(client),
          federationProviders: federation.availableProviders,
        },
        actions: {
          "login.check_email": {
            url: url("/login/check_email"),
            method: "POST",
            payload: {
              email: "",
            },
          },
          "login.check_password": {
            url: url("/login/check_password"),
            method: "POST",
            payload: {
              email: "",
              password: "",
            },
          },
          abort: {
            url: url(`/abort`),
            method: "POST",
          },
        },
      },
    });
  });

  // [stateless] redirect to initial render page
  router.get("/login/:any*", ctx => {
    return render(ctx, {
      redirect: url("/login") + (ctx.search || ""),
    });
  });

  // [stateless] check login email exists
  router.post("/login/check_email", async ctx => {
    const {email} = ctx.request.body;
    const user = await idp.findOrFail({claims: {email: email || ""}});
    return ctx.body = {
      user: await getPublicUserProps(user),
    };
  });

  // handle login
  router.post("/login/check_password", parseContext, async ctx => {
    const {interaction} = ctx.locals as InteractionRequestContext;
    const {email, password} = ctx.request.body;

    // check account and password
    const user = await idp.findOrFail({claims: {email: email || ""}});
    if (!await user.assertCredentials({password: password || ""})) {
      throw new Errors.InvalidCredentialsError();
    }

    // finish interaction and give redirection uri
    const login = {
      account: user.id,
      remember: true,
      // acr: string, // acr value for the authentication
      // ts: number, // unix timestamp of the authentication, defaults to now()
    };

    const redirect = await provider.interactionResult(ctx.req, ctx.res, {
      ...interaction.result,
      login,
    }, {
      mergeWithLastSubmission: true,
    });

    // overwrite session
    await provider.setProviderSession(ctx.req, ctx.res, login);

    return render(ctx, {
      redirect,
    });
  });
};

import { Errors } from "../../identity/error";
import { InteractionMiddleware, InteractionRequestContext } from "./interaction";

export const useFederationInteraction: InteractionMiddleware = ({ provider, router, federation }) => {

  router.post("/federate", async (ctx, next) => {
    const { user, client, interaction } = ctx.locals as InteractionRequestContext;
    ctx.assert(interaction.prompt.name === "login" || interaction.prompt.name === "consent", "Invalid Request.");

    await federation.request(ctx.request.body.provider, ctx, next);
  });

  // handle ferderation callback
  router.get("/federate/:provider", async (ctx, next) => {
    const { user, client, interaction } = ctx.locals as InteractionRequestContext;
    ctx.assert(interaction.prompt.name === "login" || interaction.prompt.name === "consent", "Invalid Request.");

    const federatedUser = await federation.callback(ctx.params.provider, ctx, next);
    if (!federatedUser) {
      throw new Errors.IdentityNotExistsError();
    }

    const login = {
      account: federatedUser.id,
      remember: true,
      // acr: string, // acr value for the authentication
      // remember: boolean, // true if provider should use a persistent cookie rather than a session one, defaults to true
      // ts: number, // unix timestamp of the authentication, defaults to now()
    };

    // make user signed in
    const redirect = await provider.interactionResult(ctx.req, ctx.res, {
      ...interaction.result,
      login,
    });

    // overwrite session
    await provider.setProviderSession(ctx.req, ctx.res, login);

    return ctx.body = { redirect };
  });
};

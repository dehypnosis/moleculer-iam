import { InteractionMiddleware, InteractionRequestContext } from "./interaction";
import { getPublicClientProps, getPublicUserProps } from "./util";

export const useConsentInteraction: InteractionMiddleware = ({ provider, url, parseContext, render, router }) => {

  router.get("/consent", parseContext, async ctx => {
    const { user, client, interaction } = ctx.locals as InteractionRequestContext;
    ctx.assert(interaction.prompt.name === "consent", "Not a consent session.");

    // skip consent if client has such property
    if (client && client.skip_consent) {
      const redirect = await provider.interactionResult(ctx.req, ctx.res, {
        ...interaction.result,
        consent: {
          rejectedScopes: [],
          rejectedClaims: [],
          replace: true,
        },
      }, {
        mergeWithLastSubmission: true,
      });

      return render(ctx, {
        redirect,
      });
    }

    // or render consent form
    return render(ctx, {
      interaction: {
        name: "consent",
        data: {
          user: await getPublicUserProps(user),
          client: await getPublicClientProps(client),

          // consent data (scopes, claims)
          consent: interaction.prompt.details,
        },
        actions: {
          "consent.accept": {
            url: url("/consent/accept"),
            method: "POST",
            payload: {
              rejected_scopes: [],
              rejected_claims: [],
            },
          },
          "login": {
            url: url("/login"),
            method: "GET",
            payload: {
              change_account: "true",
            },
            urlencoded: true,
          },
          abort: {
            url: url(`/abort`),
            method: "POST",
          },
        }
      },
    });
  });

  // handle consent
  router.post("/consent/accept", parseContext, async ctx => {
    const { user, client, interaction } = ctx.locals as InteractionRequestContext;
    ctx.assert(interaction.prompt.name === "consent", "Not a consent session.");

    const { rejected_scopes = [], rejected_claims = [] } = ctx.request.body;

    // finish consent interaction and give redirection uri
    const redirect = await provider.interactionResult(ctx.req, ctx.res, {
      ...interaction.result,
      consent: {
        rejectedScopes: rejected_scopes,
        rejectedClaims: rejected_claims,
        replace: true,
      },
    }, {
      mergeWithLastSubmission: true,
    });

    return render(ctx, {
      redirect,
    });
  });
};

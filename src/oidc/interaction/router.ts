import Router from "koa-router";
import bodyParser from "koa-bodyparser";
import noCache from "koajs-nocache";
import Validator, { ValidationError, ValidationSchema } from "fastest-validator";

import { IdentityProvider } from "../../identity";
import { KoaContextWithOIDC, Provider } from "../provider";
import { render } from "./render";
import { getPublicClientProps } from "./util";

// ref: https://github.com/panva/node-oidc-provider/blob/cd9bbfb653ddfb99c574ea3d4519b6f834274e86/docs/README.md#user-flows

export const createInteractionRouter = (provider: Provider, idp: IdentityProvider): Router => {
  const validator = new Validator();

  const router = new Router({
    prefix: "/interaction",
    sensitive: true,
    strict: false,
  });

  // apply middleware
  router.use(
    noCache(),
    bodyParser(),
  );

  function urlFor(path: string) {
    return `${provider.issuer}/interaction${path}`;
  }

  async function getPublicClientPropsById(id?: string) {
    const client = id ? await provider.Client.find(id) : undefined;
    if (!client) {
      return undefined;
    }
    return getPublicClientProps(client as any);
  }

  async function getInteractionContext(ctx: KoaContextWithOIDC) {
    const {uid, prompt, params, session} = await provider.interactionDetails(ctx.req, ctx.res);
    return {
      interaction_id: uid,
      account_id: session && session.accountId || undefined,
      client: await getPublicClientPropsById(params.client_id),
      prompt,
      params,
    };
  }

  /* abort any interactions */
  router.delete("/:id", async ctx => {
    await provider.interactionFinished(ctx.req, ctx.res,
      {
        error: "access_denied",
        error_description: "end-user aborted interaction",
      }, {
        mergeWithLastSubmission: false,
      });
  });

  /* process each type of interactions */
  router.post("/:id", async ctx => {
    const context = await getInteractionContext(ctx);
    const promptName = context.prompt.name;
    const body = ctx.request.body;

    /* validate params */
    let schema: ValidationSchema | null = null;
    switch (promptName) {
      case "login":
        schema = {
          username: "string|empty:false|trim:true",
          password: "string|empty:false",
        };
        break;
      case "consent":
        break;
      default:
    }

    if (schema) {
      const errors = validator.validate(body, schema);
      if (errors !== true && errors.length > 0) {
        ctx.status = 422;
        ctx.type = "json";
        ctx.body = {
          error: "validation_error",
          error_description: errors,
        };
        return;
      }
    }

    /* update interactions */
    let redirect: string | null = null;
    switch (promptName) {
      case "login":
        const {username, password} = body;
        const account = username;
        // TODO: resolve account

        redirect = await provider.interactionResult(ctx.req, ctx.res,
          {
            // authentication/login prompt got resolved, omit if no authentication happened, i.e. the user
            // cancelled
            login: {
              account,
              // acr: string, // acr value for the authentication
              // remember: boolean, // true if provider should use a persistent cookie rather than a session one, defaults to true
              // ts: number, // unix timestamp of the authentication, defaults to now()
            },
          }, {
            mergeWithLastSubmission: true,
          });
        break;

      case "consent":
        redirect = await provider.interactionResult(ctx.req, ctx.res,
          {
            consent: {},
          }, {
            mergeWithLastSubmission: true,
          });
        break;

      default:
        ctx.throw("not implemented");
    }

    if (redirect) {
      ctx.type = "json";
      ctx.body = {redirect};
    }
  });

  /* render application for any interactions */
  router.get("*", async ctx => {
    const context = await getInteractionContext(ctx);

    // create form data format
    const submitFormData: any = {};
    switch (context.prompt.name) {
      case "login":
        submitFormData.username = context.params.login_hint || "";
        submitFormData.password = "";
        break;

      case "consent":
        break;

      default:
    }

    render(ctx, {
      context,
      action: {
        submit: {
          url: urlFor(`/${context.interaction_id}`),
          method: "POST",
          data: submitFormData,
        },
        abort: {
          url: urlFor(`/${context.interaction_id}`),
          method: "DELETE",
          data: {},
        },
      },
    });
  });

  return router;
};

// module.exports = function devInteractions(provider) {
//   /* eslint-disable no-multi-str */
//   attention.warn('a quick start development-only feature devInteractions is enabled, \
// you are expected to disable these interactions and provide your own');
//
//   const configuration = instance(provider).configuration('interactions');
//
//   /* istanbul ignore if */
//   if (configuration.url !== defaultInteractionUri) {
//     attention.warn('you\'ve configured your own interactions.url but devInteractions are still enabled, \
// your configuration is not in effect');
//   }
//   /* eslint-enable */
//
//   instance(provider).configuration('interactions').url = async function interactionUrl(ctx) {
//     return url.parse(ctx.oidc.urlFor('interaction', { uid: ctx.oidc.uid })).pathname;
//   };
//
//   return {
//     render: [
//       noCache,
//       async function interactionRender(ctx, next) {
//         const {
//           uid, prompt, params, session,
//         } = await provider.interactionDetails(ctx.req, ctx.res);
//         const client = await provider.Client.find(params.client_id);
//
//         let view;
//         let title;
//
//         switch (prompt.name) {
//           case 'login':
//             view = 'login';
//             title = 'Sign-in';
//             break;
//           case 'consent':
//             view = 'interaction';
//             title = 'Authorize';
//             break;
//           default:
//             ctx.throw(501, 'not implemented');
//         }
//
//         const locals = {
//           client,
//           uid,
//           abortUrl: ctx.oidc.urlFor('abort', { uid }),
//           submitUrl: ctx.oidc.urlFor('submit', { uid }),
//           details: prompt.details,
//           prompt: prompt.name,
//           params,
//           title,
//           session: session ? dbg(session) : undefined,
//           dbg: {
//             params: dbg(params),
//             prompt: dbg(prompt),
//           },
//         };
//
//         locals.body = views[view](locals);
//
//         ctx.type = 'html';
//         ctx.body = views.layout(locals);
//
//         await next();
//       },
//     ],
//     abort: [
//       noCache,
//       function interactionAbort(ctx) {
//         const result = {
//           error: 'access_denied',
//           error_description: 'End-User aborted interaction',
//         };
//
//         return provider.interactionFinished(ctx.req, ctx.res, result, {
//           mergeWithLastSubmission: false,
//         });
//       },
//     ],
//     submit: [
//       noCache,
//       parseBody,
//       async function interactionSubmit(ctx, next) {
//         ctx.oidc.uid = ctx.params.uid;
//         const { prompt: { name } } = await provider.interactionDetails(ctx.req, ctx.res);
//         switch (ctx.oidc.body.prompt) { // eslint-disable-line default-case
//           case 'login': {
//             assert.equal(name, 'login');
//             await provider.interactionFinished(ctx.req, ctx.res, {
//               login: { account: ctx.oidc.body.login },
//             }, { mergeWithLastSubmission: false });
//             break;
//           }
//           case 'consent': {
//             assert.equal(name, 'consent');
//             const result = { consent: {} };
//             await provider.interactionFinished(ctx.req, ctx.res, result, {
//               mergeWithLastSubmission: true,
//             });
//             break;
//           }
//           /* istanbul ignore next */
//           default:
//             ctx.throw(501, 'not implemented');
//         }
//
//         await next();
//       },
//     ],
//   };
// };

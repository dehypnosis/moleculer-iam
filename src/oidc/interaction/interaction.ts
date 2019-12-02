import Router from "koa-router";
import bodyParser from "koa-bodyparser";
import noCache from "koajs-nocache";
import Validator, { ValidationError, ValidationSchema } from "fastest-validator";
import { IdentityProvider } from "../../identity";
import { Logger } from "../../logger";
import { KoaContextWithOIDC, Provider, interactionPolicy, Configuration } from "../provider";
import { ClientApplicationRenderer } from "./render";
import { getPublicClientProps } from "./util";

// ref: https://github.com/panva/node-oidc-provider/blob/cd9bbfb653ddfb99c574ea3d4519b6f834274e86/docs/README.md#user-flows

export type InteractionFactoryProps = {
  identity: IdentityProvider;
  renderer: ClientApplicationRenderer;
  logger: Logger;
};

export class InteractionFactory {
  private readonly validator: Validator;
  private readonly router: Router<any, any>;

  constructor(protected readonly props: InteractionFactoryProps) {
    this.validator = new Validator();

    this.router = new Router({
      prefix: "/interaction",
      sensitive: true,
      strict: false,
    });

    // apply middleware
    this.router.use(
      noCache(),
      bodyParser(),
    );
  }

  /*
  * add more user interactive features (prompts) into base policy which includes login, consent prompts
  * example ref (base): https://github.com/panva/node-oidc-provider/tree/master/lib/helpers/interaction_policy/prompts

  * example route mappings (original default)
  get('interaction', '/interaction/:uid', error(this), ...interaction.render);
  post('submit', '/interaction/:uid', error(this), ...interaction.submit);
  get('abort', '/interaction/:uid/abort', error(this), ...interaction.abort);

  * each route handlers
  https://github.com/panva/node-oidc-provider/blob/8fb8af509c652b13620534cc755cf5b9320f694f/lib/actions/interaction.js

  * related views
  https://github.com/panva/node-oidc-provider/blob/master/lib/views/layout.js
  */
  public interactions(): Configuration["interactions"] {
    const {Prompt, Check, base} = interactionPolicy;
    const defaultPrompts = base();
    return {
      async url(ctx, interaction) {
        return `/interaction/${ctx.oidc.uid}`;
      },

      // ref: https://github.com/panva/node-oidc-provider/blob/cd9bbfb653ddfb99c574ea3d4519b6f834274e86/docs/README.md#user-flows
      // ... here goes more interactions
      policy: [
        defaultPrompts.get("login"),
        defaultPrompts.get("consent"),
      ],
    };
  }

  /* create interaction routes */
  public routes(provider: Provider) {
    /* helper methods */
    function url(path: string) {
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

    const router = this.router;
    const {identity, renderer, logger} = this.props;

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
        const errors = this.validator.validate(body, schema);
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

      return renderer.render(ctx, {
        context,
        action: {
          submit: {
            url: url(`/${context.interaction_id}`),
            method: "POST",
            data: submitFormData,
          },
          abort: {
            url: url(`/${context.interaction_id}`),
            method: "DELETE",
            data: {},
          },
        },
      });
    });

    return router.routes();
  }
}

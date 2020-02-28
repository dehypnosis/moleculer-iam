import Router, { IMiddleware } from "koa-router";
import bodyParser from "koa-bodyparser";
import noCache from "koajs-nocache";
import compose from "koa-compose";
import { Identity, IdentityProvider } from "../../identity";
import { Logger } from "../../logger";
import { Client, Interaction, interactionPolicy, KoaContextWithOIDC, Provider, OIDCProviderDiscoveryMetadata } from "../provider";
import { IdentityFederationManager, IdentityFederationManagerOptions } from "./federation";
import { getStaticInteractionActions } from "./interaction.actions";
import { InternalInteractionConfigurationFactory } from "./interaction.internal";
import { InteractionActionEndpoints, InteractionRenderer, InteractionRendererAdapter } from "./interaction.render";

export type InteractionMiddlewareProps = {
  logger: Logger;
  router: Router<any, any>;
  parseContext: IMiddleware;
  render: InteractionRenderer["render"];
  actions: { [name: string]: InteractionActionEndpoints };
  provider: Provider;
  url: (path: string) => string;
  idp: IdentityProvider;
  federation: InstanceType<typeof IdentityFederationManager>;
  federationCallbackURL: (provider: string) => string;
  devModeEnabled: boolean;
};
export type InteractionMiddleware = (props: InteractionMiddlewareProps) => void;

import { useErrorMiddleware } from "./interaction.error";
import { useAbortInteraction } from "./interaction.abort";
import { useLoginInteraction } from "./interaction.login";
import { useFederationInteraction } from "./interaction.federation";
import { useConsentInteraction } from "./interaction.consent";
import { useRegisterInteraction } from "./interaction.register";
import { useVerifyEmailInteraction } from "./interaction.verify_email";
import { useVerifyPhoneInteraction } from "./interaction.verify_phone";
import { useResetPasswordInteraction } from "./interaction.reset_password";

/*
* can add more user interactive features (prompts) into base policy which includes login, consent prompts
* INTERACTION:  https://github.com/panva/node-oidc-provider/blob/cd9bbfb653ddfb99c574ea3d4519b6f834274e86/docs/README.md#user-flows
* PROMPT:       https://github.com/panva/node-oidc-provider/tree/master/lib/helpers/interaction_policy/prompts
* ROUTE:        https://github.com/panva/node-oidc-provider/blob/06940e52ec5281d33bac2208fc014ac5ac741d5a/example/routes/koa.js
*/

export type InteractionFactoryProps = {
  idp: IdentityProvider;
  logger: Logger;
  metadata: OIDCProviderDiscoveryMetadata;
  devModeEnabled: boolean;
};

export type InteractionFactoryOptions = {
  federation?: IdentityFederationManagerOptions;
  renderer?: InteractionRendererAdapter;
};

export type InteractionRequestContext = {
  interaction: Interaction,
  user?: Identity,
  client?: Client,
};

export class InteractionFactory {
  private readonly renderer: InteractionRenderer;
  private readonly internal: InternalInteractionConfigurationFactory;

  constructor(protected readonly props: InteractionFactoryProps, protected readonly opts: InteractionFactoryOptions = {}) {

    // create renderer
    if (!opts.renderer) {
      opts.renderer = new (require("moleculer-iam-interaction-renderer").default)(); // to avoid circular deps in our monorepo workspace
    }
    this.renderer = new InteractionRenderer({
      ...props,
      adapter: opts.renderer!,
    });

    // create internal interaction factory
    this.internal = new InternalInteractionConfigurationFactory({ ...props, renderer: this.renderer });
  }

  public configuration(): any {
    const { Prompt, Check, base } = interactionPolicy;
    const defaultPrompts = base();
    return {
      interactions: {
        async url(ctx: KoaContextWithOIDC, interaction: Interaction) {
          return `/interaction/${interaction.prompt.name}`;
        },
        policy: [
          // can modify policy and add prompt like: MFA, captcha, ...
          defaultPrompts.get("login"),
          defaultPrompts.get("consent"),
        ],
      },
      ...this.internal.configuration(),
    };
  }

  /* create interaction routes */
  public routes(provider: Provider) {
    // create router
    const router = new Router({
      prefix: "/interaction",
      sensitive: true,
      strict: false,
    })
      .use(
        noCache(),
        bodyParser(),
      );

    // prepare route props
    const { idp, logger } = this.props;
    const url = (path: string) => `${provider.issuer}/interaction${path}`;
    const federationCallbackURL = (providerName: string) => `${url("/federate")}/${providerName}`;
    const federation = new IdentityFederationManager({
      logger,
      idp,
      callbackURL: federationCallbackURL,
    }, this.opts.federation);
    const actions = getStaticInteractionActions({
      url,
      availableFederationProviders: federation.availableProviders,
    });

    const props: InteractionMiddlewareProps = {
      devModeEnabled: this.props.devModeEnabled,
      logger,
      idp,
      provider,
      router,
      actions,
      url,
      federationCallbackURL,
      parseContext: async (ctx: any, next) => {
        // fetch interaction details
        const interaction = await provider.interactionDetails(ctx.req, ctx.res);

        // fetch identity and client
        const user = interaction.session && typeof interaction.session.accountId === "string" ? (await idp.findOrFail({ id: interaction.session.accountId })) : undefined;
        const client = interaction.params.client_id ? (await provider.Client.find(interaction.params.client_id)) : undefined;
        const locals: InteractionRequestContext = { interaction, user, client } as any;
        ctx.locals = locals;

        return next();
      },
      render: this.renderer.render.bind(this.renderer),
      federation,
    };

    // apply middleware
    useErrorMiddleware(props);

    // map sub routes
    useAbortInteraction(props);
    useLoginInteraction(props);
    useFederationInteraction(props);
    useConsentInteraction(props);
    useVerifyPhoneInteraction(props);
    useVerifyEmailInteraction(props);
    useResetPasswordInteraction(props);
    useRegisterInteraction(props);

    // merge routes
    return compose([
      router.routes(),
      ...this.renderer.routes(),
    ]);
  }
}

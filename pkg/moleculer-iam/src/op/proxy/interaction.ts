import * as _ from "lodash";
import bodyParser from "koa-bodyparser";
import compose from "koa-compose";
import mount from "koa-mount";
import Router, { IMiddleware } from "koa-router";
import noCache from "koajs-nocache";
import { ClientMetadata, Configuration, interactionPolicy } from "oidc-provider";
import { IdentityFederationBuilder } from "./federation";
import { InteractionMetadata, InteractionRequestContext, InteractionResponse } from "./interaction.types";
import { OIDCError } from "./error.types";
import { OIDCAccountClaims } from "./identity.types";
import { Client, Interaction, DeviceInfo, DiscoveryMetadata } from "./proxy.types";
import { Identity } from "../../idp";
import { Logger } from "../../logger";
import { dummyInteractionPageRendererFactory, InteractionPageRenderer, InteractionPageRendererFactory } from "./renderer";
import { DeviceFlowConfiguration, DynamicConfiguration, ProviderConfigBuilder } from "./config";

// ref: https://github.com/panva/node-oidc-provider/blob/9306f66bdbcdff01400773f26539cf35951b9ce8/lib/models/client.js#L385
// @ts-ignore : need to hack oidc-provider private methods
import getProviderHiddenProps from "oidc-provider/lib/helpers/weak_cache";
// @ts-ignore : need to hack oidc-provider private methods
import sessionMiddleware from "oidc-provider/lib/shared/session";

const JSON = "application/json";
const HTML = "text/html";

export class ProviderInteractionBuilder {
  public readonly router: Router<any, InteractionRequestContext>;
  private readonly logger: Logger;
  public readonly federation: IdentityFederationBuilder;

  constructor(private readonly builder: ProviderConfigBuilder) {
    this.logger = builder.logger;

    // create router
    this.router = new Router<any, InteractionRequestContext>({
      prefix: this.prefix,
      sensitive: true,
      strict: false,
    })
      .use(...this.commonMiddleware);

    (this.router as any)._setPrefix = this.router.prefix.bind(this.router);
    this.router.prefix = () => {
      this.logger.warn("rather call builder.setPrefix, it will not affect");
      return this.router;
    };

    // create federation builder
    this.federation = new IdentityFederationBuilder(this.builder);
  }

  private _prefix: string = "/op";
  public get prefix(): string {
    return this._prefix;
  }

  public _dangerouslySetPrefix(prefix: string) {
    this.builder.assertBuilding();
    this._prefix = prefix;
    (this.router as any)._setPrefix(prefix).use(...this.commonMiddleware); // re-apply middleware
    this.logger.info(`interaction route path configured:`, `${prefix}/:path`);
  }

  public get idp() {
    return this.builder.idp;
  }

  public get op() {
    return this.builder._dagerouslyGetProvider();
  }

  public readonly getURL = (path: string) => `${this.builder.issuer}${this.prefix}${path}`;

  private readonly parseContext: IMiddleware<any, InteractionRequestContext> = async (ctx, next) => {
    const { idp, op } = this;

    // @ts-ignore ensure oidc context is created
    if (!ctx.oidc) {
      const OIDCContext = getProviderHiddenProps(op).OIDCContext;
      Object.defineProperty(ctx, "oidc", { value: new OIDCContext(ctx) });
    }
    const configuration: Configuration = getProviderHiddenProps(op).configuration();
    const session = await op.Session.get(ctx as any);
    const getURL = this.getURL;
    const getNamedURL = (name: string, opts?: any) => (op as any).urlFor(name, opts);

    const metadata: InteractionMetadata = {
      availableFederationProviders: this.federation.providerNames,
      // availableScopes: await this.idp.claims.getActiveClaimsSchemata()
      //   .then(schemata =>
      //     schemata.reduce((scopes, schema) => {
      //       scopes[schema.scope] = scopes[schema.scope] || {};
      //       scopes[schema.scope][schema.key] = schema.validation;
      //       return scopes;
      //     }, {} as any)
      //   ),
      mandatoryScopes: this.idp.claims.mandatoryScopes,
      locale: ctx.locale,
      discovery: configuration.discovery as DiscoveryMetadata,
      xsrf: session.state && session.state.secret || undefined,
    };

    ctx.idp = idp;
    ctx.op = {
      render: async page => {
        const response: InteractionResponse = {
          page: {
            name: "undefined",
            actions: {},
            ...page,
            metadata,
            state: session.state && session.state.custom || {},
          },
        };

        if (ctx.accepts(JSON, HTML) === JSON) {
          ctx.type = JSON;
          ctx.body = response;
          return;
        }
        ctx.type = HTML;
        return this.pageRenderer.render(ctx, response);
      },
      redirectWithUpdate: async (result, allowedPromptNames?: string[]) => {
        const interaction = ctx.op.interaction;
        ctx.assert(interaction && (!allowedPromptNames || allowedPromptNames.includes(interaction.prompt.name)));

        const mergedResult = {...ctx.op.interaction!.result, ...result};
        const redirectURL = await op.interactionResult(ctx.req, ctx.res, mergedResult, { mergeWithLastSubmission: true });

        // overwrite session account if need
        if (mergedResult.login) {
          await op.setProviderSession(ctx.req, ctx.res, mergedResult.login);
          await fetchInteractionDetails();
        }
        return ctx.redirect(redirectURL);
      },
      redirect: url => ctx.redirect(url.startsWith("/") ? getURL(url) : url),
      end: () => {
        const response: InteractionResponse = (session as any).touched
          ? { state: session.state && session.state.custom || {} }
          : {};
        ctx.type = JSON;
        ctx.body = response;
      },
      assertPrompt: (allowedPromptNames?: string[], message?: string) => {
        const interaction = ctx.op.interaction;
        ctx.assert(interaction && (!allowedPromptNames || allowedPromptNames.includes(interaction.prompt.name)), 400, message || "invalid_request");
      },
      session: session as any,
      setSessionState: async update => {
        if (!session.state) {
          session.state = { custom: {} };
        } else if (!session.state.custom) {
          session.state.custom = {};
        }
        session.state.custom = update(session.state.custom);
        await sessionMiddleware(ctx, () => {
          // @ts-ignore to set Set-Cookie response header
          session.touched = true;
        });
        // store/update session in to adapter
        await session.save();
        return session.state.custom;
      },
      metadata,
      getURL,
      getNamedURL,
    };

    const fetchInteractionDetails = async () => {
      try {
        const interaction = await op.interactionDetails(ctx.req, ctx.res) as Interaction;
        ctx.op.interaction = interaction;
        ctx.op.user = interaction.session && typeof interaction.session.accountId === "string" ? (await idp.findOrFail({ id: interaction.session.accountId })) : undefined;
        if (ctx.op.user) {
          ctx.op.metadata.user = await this.getPublicUserProps(ctx.op.user);
        }
        ctx.op.client = interaction.params.client_id ? (await op.Client.find(interaction.params.client_id) as Client) : undefined;
        if (ctx.op.client) {
          ctx.op.metadata.client = await this.getPublicClientProps(ctx.op.client);
        }
      } catch (err) {}
    };

    await fetchInteractionDetails();

    return next();
  };

  private readonly errorHandler: IMiddleware<any, InteractionRequestContext> = async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      this.logger.error("interaction error", err);

      // normalize error
      const { error, name, message, status, statusCode, code, status_code, error_description, expose, ...otherProps } = err;
      let normalizedStatus = status || statusCode || code || status_code || 500;
      if (isNaN(normalizedStatus)) normalizedStatus = 500;

      const normalizedError = {
        error: error || name,
        error_description: error_description || message || "Unexpected error.",
        ...((expose || this.builder.dev) ? otherProps : {}),
      };

      if (!normalizedError.error || normalizedError.error === "InternalServerError") {
        normalizedError.error = "internal_server_error";
        normalizedError.error_description = "Cannot handle the invalid request.";
      }

      if (normalizedError.error_description.startsWith("unrecognized route or not allowed method")) {
        normalizedError.error_description = "Cannot handle the unrecognized route or not allowed method.";
      }

      ctx.status = normalizedStatus;
      return ctx.op.render({
        name: "error",
        error: normalizedError,
      });
    }
  };

  private readonly commonMiddleware = [
    noCache(),
    bodyParser(),
    this.parseContext,
    this.errorHandler,
  ];

  private readonly middleware: compose.Middleware<InteractionRequestContext>[] = [];
  public use(...middleware: compose.Middleware<InteractionRequestContext>[]) {
    this.builder.assertBuilding();
    this.middleware.push(...middleware);
    return this;
  }

  // default render function
  public setPageRenderer<F extends InteractionPageRendererFactory>(factory: F, options?: F extends InteractionPageRendererFactory<infer O> ? O : never) {
    this._pageRenderer = factory({
      prefix: this.prefix,
      dev: this.builder.dev,
      logger: this.logger,
    }, options);
    return this;
  }

  private _pageRenderer?: InteractionPageRenderer;
  public get pageRenderer() {
    if (!this._pageRenderer) {
      this.setPageRenderer(dummyInteractionPageRendererFactory);
    }
    return this._pageRenderer!;
  }

  // internally named routes render default functions
  private renderError: (ctx: InteractionRequestContext, error: OIDCError) => Promise<void> = async (ctx, error) => {
    return this.errorHandler(ctx as any, () => {
      throw error;
    });
  };

  // ref: https://github.com/panva/node-oidc-provider/blob/74b434c627248c82ca9db5aed3a03f0acd0d7214/lib/shared/error_handler.js#L47
  private readonly renderErrorProxy: NonNullable<DynamicConfiguration["renderError"]> = (ctx, out, error) => {
    return this.parseContext(ctx as any, () => {
      this.logger.error("internal render error", error);
      return this.renderError(ctx as any, out);
    });
  };

  private renderLogout: (ctx: InteractionRequestContext, xsrf: string) => Promise<void> = async (ctx, xsrf) => {
    return ctx.op.render({
      name: "logout",
      actions: {
        // destroy sessions
        "logout.confirm": {
          url: ctx.op.getNamedURL("end_session_confirm"),
          method: "POST",
          payload: {
            xsrf,
            logout: "true",
          },
          urlencoded: true,
        },
        // without session destroy
        "logout.redirect": {
          url: ctx.op.getNamedURL("end_session_confirm"),
          method: "POST",
          payload: {
            xsrf,
          },
          urlencoded: true,
        },
      },
    });
  };

  // ref: https://github.com/panva/node-oidc-provider/blob/e5ecd85c346761f1ac7a89b8bf174b873be09239/lib/actions/end_session.js#L89
  private readonly logoutSourceProxy: NonNullable<DynamicConfiguration["logoutSource"]> = (ctx) => {
    const op: InteractionRequestContext["op"] = ctx.op as any;
    return this.parseContext(ctx as any, () => {
      ctx.assert(op.user);
      const xsrf = op.session.state.secret;
      return this.renderLogout(ctx as any, xsrf);
    });
  };

  private renderLogoutEnd: (ctx: InteractionRequestContext) => Promise<void> = async (ctx) => {
    return ctx.op.render({
      name: "logout.end",
    });
  };

  // ref: https://github.com/panva/node-oidc-provider/blob/e5ecd85c346761f1ac7a89b8bf174b873be09239/lib/actions/end_session.js#L272
  private readonly postLogoutSuccessSourceProxy: NonNullable<DynamicConfiguration["postLogoutSuccessSource"]> = async (ctx) => {
    const op: InteractionRequestContext["op"] = ctx.op as any;
    return this.parseContext(ctx as any, async () => {
      op.metadata.client = await this.getPublicClientProps(ctx.oidc.client);
      return this.renderLogoutEnd(ctx as any);
    });
  };

  private renderDeviceFlow: (ctx: InteractionRequestContext, userCode: string, xsrf: string) => Promise<void> = async (ctx, userCode, xsrf) => {
    return ctx.op.render({
      name: "device_flow",
      actions: {
        submit: {
          url: ctx.op.getNamedURL("code_verification"),
          method: "POST",
          payload: {
            xsrf,
            user_code: userCode,
          },
        },
      },
    });
  };

  // ref: https://github.com/panva/node-oidc-provider/blob/74b434c627248c82ca9db5aed3a03f0acd0d7214/lib/actions/code_verification.js#L38
  private readonly deviceFlowUserCodeInputSourceProxy: NonNullable<DeviceFlowConfiguration["userCodeInputSource"]> = (ctx, formHTML, out, error) => {
    const op: InteractionRequestContext["op"] = ctx.op as any;
    return this.parseContext(ctx as any, () => {
      ctx.assert(op.user && op.client);
      if (error || out) {
        this.logger.error("internal device code flow error", error || out);
        return this.renderError(ctx as any, (out || error) as any);
      }
      const xsrf = op.session.state.secret;
      return this.renderDeviceFlow(ctx as any, ctx.oidc.params!.user_code || "", xsrf);
    });
  };

  private renderDeviceFlowConfirm: (ctx: InteractionRequestContext, userCode: string, xsrf: string, device: DeviceInfo) => Promise<void> = async (ctx, userCode, xsrf, device) => {
    return ctx.op.render({
      name: "device_flow.confirm",
      actions: {
        verify: {
          url: ctx.op.getNamedURL("code_verification"),
          method: "POST",
          payload: {
            xsrf,
            user_code: userCode,
            confirm: "true",
          },
        },
        abort: {
          url: ctx.op.getNamedURL("code_verification"),
          method: "POST",
          payload: {
            xsrf,
            user_code: userCode,
            abort: "true",
          },
        },
      },
    });
  };

  // ref: https://github.com/panva/node-oidc-provider/blob/74b434c627248c82ca9db5aed3a03f0acd0d7214/lib/actions/code_verification.js#L54
  private readonly deviceFlowUserCodeConfirmSourceProxy: NonNullable<DeviceFlowConfiguration["userCodeConfirmSource"]> = (ctx, formHTML, client, device, userCode) => {
    const op: InteractionRequestContext["op"] = ctx.op as any;
    return this.parseContext(ctx as any, () => {
      ctx.assert(op.user && op.client);
      op.metadata.device = device;
      const xsrf = op.session.state.secret;
      return this.renderDeviceFlowConfirm(ctx as any, userCode, xsrf, device);
    });
  };

  private renderDeviceFlowEnd: (ctx: InteractionRequestContext) => Promise<void> = async (ctx) => {
    return ctx.op.render({
      name: "device_flow.end",
    });
  };

  // ref: https://github.com/panva/node-oidc-provider/blob/ae8a4589c582b96f4e9ca0432307da15792ac29d/lib/actions/authorization/device_user_flow_response.js#L42
  private readonly deviceFlowSuccessSourceProxy: NonNullable<DeviceFlowConfiguration["successSource"]> = (ctx) => {
    return this.parseContext(ctx as any, () => {
      return this.renderDeviceFlowEnd(ctx as any);
    });
  };

  private readonly _config: DynamicConfiguration["interactions"] = {
    url: (ctx, interaction) => {
      return `${this.prefix}/${interaction.prompt.name}`;
    },
    policy: [],
  };

  public setPrompts(prompts: interactionPolicy.Prompt[]) {
    this.builder.assertBuilding();
    this._config!.policy!.splice(0, this._config!.policy!.length, ...prompts);
    return this;
  }

  public _dangerouslyGetDynamicConfiguration(): Partial<DynamicConfiguration> {
    this.builder.assertBuilding();

    const {
      renderErrorProxy,
      logoutSourceProxy,
      postLogoutSuccessSourceProxy,
      deviceFlowUserCodeInputSourceProxy,
      deviceFlowUserCodeConfirmSourceProxy,
      deviceFlowSuccessSourceProxy,
    } = this;
    return {
      renderError: renderErrorProxy as any,
      logoutSource: logoutSourceProxy as any,
      interactions: this._config,
      postLogoutSuccessSource: postLogoutSuccessSourceProxy as any,
      features: {
        deviceFlow: {
          userCodeInputSource: deviceFlowUserCodeInputSourceProxy as any,
          userCodeConfirmSource: deviceFlowUserCodeConfirmSourceProxy as any,
          successSource: deviceFlowSuccessSourceProxy as any,
        },
      },
    };
  }

  public _dangerouslyBuild() {
    this.builder.assertBuilding();

    // add middleware
    const composed = [
      ...this.middleware,
    ];

    // add page renderer optional routes
    if (this.pageRenderer.routes) {
      composed.push(...this.pageRenderer.routes());
    }

    // add interaction routes
    composed.push(this.router.routes() as any);

    // mount to app
    this.op.app.use(mount(compose(composed)));

    // build federation configuration
    this.federation._dangerouslyBuild();
  }

  // utility
  public async getPublicClientProps(client?: Client): Promise<Partial<ClientMetadata> | undefined> {
    if (!client) return;
    return {
      id: client.clientId,
      name: client.clientName,
      logo_uri: client.logoUri,
      tos_uri: client.tosUri,
      policy_uri: client.policyUri,
      client_uri: client.clientUri,
    };
  }

  public async getPublicUserProps(id?: Identity): Promise<Partial<OIDCAccountClaims> | undefined> {
    if (!id) return;
    const {email, picture, name} = await id.claims("userinfo", "profile email");
    return {
      email,
      name: name || "unknown",
      picture,
    };
  }
}

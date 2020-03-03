import bodyParser from "koa-bodyparser";
import compose from "koa-compose";
import mount from "koa-mount";
import Router, { IMiddleware } from "koa-router";
import noCache from "koajs-nocache";
import Provider, { ClientMetadata } from "oidc-provider";
import { InteractionRequestContext, InteractionResponse } from "./config.interaction.types";
import { OIDCError } from "./error.types";
import { OIDCAccountClaims } from "./identity.types";
import { Client, Interaction, DeviceInfo } from "./proxy.types";
import { Identity, IdentityProvider } from "../../idp";
import { Logger } from "../../logger";
import { DeviceFlowConfiguration, DynamicConfiguration } from "./config";

// ref: https://github.com/panva/node-oidc-provider/blob/9306f66bdbcdff01400773f26539cf35951b9ce8/lib/models/client.js#L385
// @ts-ignore : need to hack oidc-provider private methods
import getProviderHiddenProps from "oidc-provider/lib/helpers/weak_cache";
// @ts-ignore : need to hack oidc-provider private methods
import sessionMiddleware from "oidc-provider/lib/shared/session";

export type ProviderInteractionBuilderProps = {
  logger: Logger;
  getProvider: () => Provider;
  idp: IdentityProvider;
  issuer: string;
  dev: boolean;
}

export class ProviderInteractionBuilder {
  public readonly router: Router<any, InteractionRequestContext>;
  private readonly logger: Logger;
  public static contentTypes = {
    JSON: "application/json",
    HTML: "text/html",
  };

  constructor(private readonly props: ProviderInteractionBuilderProps) {
    this.logger = props.logger;

    this.router = new Router<any, InteractionRequestContext>({
      prefix: this.prefix,
      sensitive: true,
      strict: false,
    })
      .use(...this.commonMiddleware);

    this.setRouterPrefix = this.router.prefix.bind(this.router);
    this.router.prefix = () => {
      this.logger.warn("rather call builder.setPrefix, it will not affect");
      return this.router;
    }
  }

  private readonly setRouterPrefix: any;
  private _prefix: string = "/op";
  public get prefix(): string {
    return this._prefix;
  }
  public _dangerouslySetPrefix(prefix: string) {
    this._prefix = prefix;
    this.setRouterPrefix(prefix).use(...this.commonMiddleware); // re-apply middleware
    this.logger.info(`interaction router path configured:`, `${prefix}/:routes`);
  }

  public readonly url = (path: string) => `${this.props.issuer}${this.prefix}${path}`;

  private readonly parseContext: IMiddleware<any, InteractionRequestContext> = async (ctx, next) => {
    // @ts-ignore ensure oidc context is created
    if (!ctx.oidc) {
      const OIDCContext = getProviderHiddenProps(this.op).OIDCContext;
      Object.defineProperty(ctx, "oidc", { value: new OIDCContext(ctx) });
    }

    const session = await this.op.Session.get(ctx as any);
    // TODO: fix render function to handle XHR by itself
    // TODO: fix this builder ctx.op mess up as context class
    // TODO: then rename config.interaction.*
    // TODO: then remove ../interaction/renderer and checkout this render function...
    // TODO: also move federation manager here..
    // TODO: then update client logic to handle three typeof response
    // TODO: then remove getClientState from client
    // TODO: then rename useServerState.... as use interaction response
    ctx.op = {
      response: {
        render: page => {
          ctx.type = ProviderInteractionBuilder.contentTypes.HTML;
          return this.render(ctx, {
            page,
            session: session.state && session.state.custom || {},
            locale: ctx.locale,
            metadata: this.metadata,
          });
        },
        renderError: error => {
          const { JSON, HTML } = ProviderInteractionBuilder.contentTypes;

          // response for ajax
          if (ctx.accepts(JSON, HTML) === JSON) {
            ctx.type = JSON;
            ctx.body = { error };
            return;
          }
          return this.render(ctx, { error });
        },
        redirect: async url => ctx.redirect(url),
        updateSessionState: async state => {
          const sessionState = await ctx.op.setSessionState(prevState => ({
            ...prevState,
            ...state,
          }));
          const response: InteractionResponse = { session: sessionState };
          ctx.type = "json";
          ctx.body = response;
        },
        updateInteractionResult: async (partialInteractionResult) => {
          const mergedResult = {...ctx.op.interaction!.result, ...partialInteractionResult};
          const redirectURL = await this.op.interactionResult(ctx.req, ctx.res, mergedResult, { mergeWithLastSubmission: true });
          if (mergedResult.login) { // overwrite session account if need
            await this.op.setProviderSession(ctx.req, ctx.res, mergedResult.login);
          }
          return ctx.op.response.redirect(redirectURL);
        },
      },
      provider: this.op,
      session,
      setSessionState: async fn => {
        if (!session.state) {
          session.state = { custom: {} };
        } else if (!session.state.custom) {
          session.state.custom = {};
        }
        session.state.custom = fn(session.state.custom);
        await sessionMiddleware(ctx, () => {
          // @ts-ignore to set Set-Cookie response header
          ctx.oidc.session.touched = true;
        });
        // store/update session in to adapter
        await session.save();
        // @ts-ignore
        delete session.touched;
        return session.state.custom;
      },
      url: this.url,
      namedUrl: (name: string, opts?: any) => (this.op as any).urlFor(name, opts),
      data: {},
      xsrf: session.state && session.state.secret || undefined,
    };
    ctx.idp = this.idp;

    // fetch interaction details
    try {
      const interaction = await this.op.interactionDetails(ctx.req, ctx.res) as Interaction;
      ctx.op.interaction = interaction;
      ctx.op.user = interaction.session && typeof interaction.session.accountId === "string" ? (await this.idp.findOrFail({ id: interaction.session.accountId })) : undefined;
      if (ctx.op.user) {
        ctx.op.data.user = await this.getPublicUserProps(ctx.op.user);
      }
      ctx.op.client = interaction.params.client_id ? (await this.op.Client.find(interaction.params.client_id) as Client) : undefined;
      if (ctx.op.client) {
        ctx.op.data.client = await this.getPublicClientProps(ctx.op.client);
      }
    } catch (err) {}

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
        ...((expose || this.props.dev) ? otherProps : {}),
      };

      if (!normalizedError.error || normalizedError.error === "InternalServerError") {
        normalizedError.error = "internal_server_error";
        normalizedError.error_description = "Cannot handle the invalid request.";
      }

      if (normalizedError.error_description.startsWith("unrecognized route or not allowed method")) {
        normalizedError.error_description = "Cannot handle the unrecognized route or not allowed method.";
      }

      ctx.status = normalizedStatus;
      return ctx.op.response.renderError(normalizedError);
    }
  };

  private readonly commonMiddleware = [
    noCache(),
    bodyParser(),
    this.parseContext,
    this.errorHandler,
  ];

  public get op() {
    return this.props.getProvider();
  }

  public get metadata() {
    return getProviderHiddenProps(this.op).configuration().discovery;
  }

  public get idp() {
    return this.props.idp;
  }

  private readonly composed: compose.Middleware<InteractionRequestContext>[] = [];
  public use(...middleware: compose.Middleware<InteractionRequestContext>[]) {
    this.composed.push(...middleware);
    return this;
  }

  public build() {
    // compose middleware and mount routes to app
    this.op.app.use(
      mount(
        compose([
          ...this.composed,
          this.router.routes(),
        ]),
      ),
    );
  }

  // default render function
  public setRenderFunction(render: ProviderInteractionBuilder["render"]) {
    this.render = render;
  }
  private render = async (ctx: InteractionRequestContext, response: InteractionResponse) => {
    this.logger.warn("interaction render function not configured");
    ctx.body = response;
  };

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
    return ctx.op.response.render({
      name: "logout",
      data: ctx.op.data,
      actions: {
        // destroy sessions
        "logout.confirm": {
          url: ctx.op.namedUrl("end_session_confirm"),
          method: "POST",
          payload: {
            xsrf,
            logout: "true",
          },
          urlencoded: true,
        },
        // without session destroy
        "logout.redirect": {
          url: ctx.op.namedUrl("end_session_confirm"),
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
    return this.parseContext(ctx as any, () => {
      ctx.assert(ctx.op.user);
      const xsrf = ctx.op.session.state.secret;
      return this.renderLogout(ctx as any, xsrf);
    });
  };

  private renderLogoutEnd: (ctx: InteractionRequestContext) => Promise<void> = async (ctx) => {
    return ctx.op.response.render({
      name: "logout.end",
      data: ctx.op.data,
    });
  };

  // ref: https://github.com/panva/node-oidc-provider/blob/e5ecd85c346761f1ac7a89b8bf174b873be09239/lib/actions/end_session.js#L272
  private readonly postLogoutSuccessSourceProxy: NonNullable<DynamicConfiguration["postLogoutSuccessSource"]> = async (ctx) => {
    return this.parseContext(ctx as any, async () => {
      ctx.op.data.client = await this.getPublicClientProps(ctx.oidc.client);
      return this.renderLogoutEnd(ctx as any);
    });
  };

  private renderDeviceFlow: (ctx: InteractionRequestContext, userCode: string, xsrf: string) => Promise<void> = async (ctx, userCode, xsrf) => {
    return ctx.op.response.render({
      name: "device_flow",
      data: ctx.op.data,
      actions: {
        submit: {
          url: ctx.op.namedUrl("code_verification"),
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
    return this.parseContext(ctx as any, () => {
      ctx.assert(ctx.op.user && ctx.op.client);
      if (error || out) {
        this.logger.error("internal device code flow error", error || out);
        return this.renderError(ctx as any, (out || error) as any);
      }
      const xsrf = ctx.op.session.state.secret;
      return this.renderDeviceFlow(ctx as any, ctx.oidc.params!.user_code || "", xsrf);
    });
  };

  private renderDeviceFlowConfirm: (ctx: InteractionRequestContext, userCode: string, xsrf: string, device: DeviceInfo) => Promise<void> = async (ctx, userCode, xsrf, device) => {
    return ctx.op.response.render({
      name: "device_flow.confirm",
      data: ctx.op.data,
      actions: {
        verify: {
          url: ctx.op.namedUrl("code_verification"),
          method: "POST",
          payload: {
            xsrf,
            user_code: userCode,
            confirm: "true",
          },
        },
        abort: {
          url: ctx.op.namedUrl("code_verification"),
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
    return this.parseContext(ctx as any, () => {
      ctx.assert(ctx.op.user && ctx.op.client);
      ctx.op.data.device = device;
      const xsrf = ctx.op.session.state.secret;
      return this.renderDeviceFlowConfirm(ctx as any, userCode, xsrf, device);
    });
  };

  private renderDeviceFlowEnd: (ctx: InteractionRequestContext) => Promise<void> = async (ctx) => {
    return ctx.op.response.render({
      name: "device_flow.end",
      data: ctx.op.data,
    });
  };

  // ref: https://github.com/panva/node-oidc-provider/blob/ae8a4589c582b96f4e9ca0432307da15792ac29d/lib/actions/authorization/device_user_flow_response.js#L42
  private readonly deviceFlowSuccessSourceProxy: NonNullable<DeviceFlowConfiguration["successSource"]> = (ctx) => {
    return this.parseContext(ctx as any, () => {
      return this.renderDeviceFlowEnd(ctx as any);
    });
  };

  public get namedRoutesProxy() {
    const {
      renderErrorProxy,
      logoutSourceProxy,
      postLogoutSuccessSourceProxy,
      deviceFlowUserCodeInputSourceProxy,
      deviceFlowUserCodeConfirmSourceProxy,
      deviceFlowSuccessSourceProxy,
    } = this;
    return {
      renderErrorProxy: renderErrorProxy as any,
      logoutSourceProxy: logoutSourceProxy as any,
      postLogoutSuccessSourceProxy: postLogoutSuccessSourceProxy as any,
      deviceFlowUserCodeInputSourceProxy: deviceFlowUserCodeInputSourceProxy as any,
      deviceFlowUserCodeConfirmSourceProxy: deviceFlowUserCodeConfirmSourceProxy as any,
      deviceFlowSuccessSourceProxy: deviceFlowSuccessSourceProxy as any,
    };
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

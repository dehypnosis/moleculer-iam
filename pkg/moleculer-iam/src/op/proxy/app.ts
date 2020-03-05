import bodyParser from "koa-bodyparser";
import compose from "koa-compose";
import mount from "koa-mount";
import Router, { IMiddleware } from "koa-router";
import noCache from "koajs-nocache";
import { interactionPolicy } from "oidc-provider";
import { snakeCase } from "change-case";
import { OIDCProviderContextProxy } from "./context";
import { IdentityFederationBuilder } from "./federation";
import { ApplicationRequestContext } from "./app.types";
import { OIDCError } from "./error.types";
import { DeviceInfo } from "./proxy.types";
import { Logger } from "../../logger";
import { dummyAppStateRendererFactory, ApplicationRenderer, ApplicationRendererFactory } from "./renderer";
import { DeviceFlowConfiguration, DynamicConfiguration, ProviderConfigBuilder } from "./config";

export class ProviderApplicationBuilder {
  public readonly router: Router<any, ApplicationRequestContext>;
  private readonly logger: Logger;
  public readonly federation: IdentityFederationBuilder;

  constructor(private readonly builder: ProviderConfigBuilder) {
    this.logger = builder.logger;

    // create router
    this.router = new Router<any, ApplicationRequestContext>({
      prefix: this.prefix,
      sensitive: true,
      strict: false,
    })
      .use(...this.routerMiddleware);

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
    (this.router as any)._setPrefix(prefix).use(...this.routerMiddleware); // re-apply middleware
    this.logger.info(`OIDC application route path configured:`, `${prefix}/:path`);
  }

  public get idp() {
    return this.builder.idp;
  }

  public get op() {
    return this.builder._dagerouslyGetProvider();
  }

  public readonly getURL = (path: string) => `${this.builder.issuer}${this.prefix}${path}`;

  private readonly wrapContext: IMiddleware<any, ApplicationRequestContext> = async (ctx, next) => {
    ctx.idp = this.idp;
    ctx.op = await new OIDCProviderContextProxy(ctx, this.builder)._dangerouslyCreate();
    ctx.unwrap = () => {
      delete ctx.idp;
      delete ctx.op;
      delete ctx.locale;
      return ctx;
    };
    return next();
  };

  private readonly errorHandler: IMiddleware<any, ApplicationRequestContext> = async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      this.logger.error("app error", err);

      // normalize error
      const { error, name, message, status, statusCode, code, status_code, error_description, expose, ...otherProps } = err;
      let normalizedStatus = status || statusCode || code || status_code || 500;
      if (isNaN(normalizedStatus)) normalizedStatus = 500;

      const normalizedError = {
        error: snakeCase(error || name),
        error_description: error_description || message || "Unexpected error.",
        ...((expose || this.builder.dev) ? otherProps : {}),
      };

      if (!normalizedError.error) {
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

  private readonly routerMiddleware = [
    noCache(),
    bodyParser(),
    this.wrapContext,
    this.errorHandler,
  ];

  // default render function
  public setRendererFactory<F extends ApplicationRendererFactory>(factory: F, options?: F extends ApplicationRendererFactory<infer O> ? O : never) {
    this._appRenderer = factory({
      prefix: this.prefix,
      dev: this.builder.dev,
      logger: this.logger,
    }, options);
    return this;
  }

  private _appRenderer?: ApplicationRenderer;
  public get appRenderer() {
    if (!this._appRenderer) {
      this.setRendererFactory(dummyAppStateRendererFactory);
    }
    return this._appRenderer!;
  }

  // internally named routes render default functions
  private renderError: (ctx: ApplicationRequestContext, error: OIDCError) => Promise<void> = async (ctx, error) => {
    return this.errorHandler(ctx as any, () => {
      throw error;
    });
  };

  // ref: https://github.com/panva/node-oidc-provider/blob/74b434c627248c82ca9db5aed3a03f0acd0d7214/lib/shared/error_handler.js#L47
  private readonly renderErrorProxy: NonNullable<DynamicConfiguration["renderError"]> = (ctx, out, error) => {
    return this.wrapContext(ctx as any, () => {
      this.logger.error("internal render error", error);
      return this.renderError(ctx as any, out);
    });
  };

  private renderLogout: (ctx: ApplicationRequestContext, xsrf: string) => Promise<void> = async (ctx, xsrf) => {
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
    const op: ApplicationRequestContext["op"] = ctx.op as any;
    return this.wrapContext(ctx as any, () => {
      ctx.assert(op.user);
      const xsrf = op.session.state.secret;
      return this.renderLogout(ctx as any, xsrf);
    });
  };

  private renderLogoutEnd: (ctx: ApplicationRequestContext) => Promise<void> = async (ctx) => {
    return ctx.op.render({
      name: "logout.end",
    });
  };

  // ref: https://github.com/panva/node-oidc-provider/blob/e5ecd85c346761f1ac7a89b8bf174b873be09239/lib/actions/end_session.js#L272
  private readonly postLogoutSuccessSourceProxy: NonNullable<DynamicConfiguration["postLogoutSuccessSource"]> = async (ctx) => {
    return this.wrapContext(ctx as any, async () => {
      const op: ApplicationRequestContext["op"] = ctx.op as any;
      op.clientMetadata = await op.getPublicClientProps(ctx.oidc.client);
      return this.renderLogoutEnd(ctx as any);
    });
  };

  private renderDeviceFlow: (ctx: ApplicationRequestContext, userCode: string, xsrf: string) => Promise<void> = async (ctx, userCode, xsrf) => {
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
    return this.wrapContext(ctx as any, () => {
      const op: ApplicationRequestContext["op"] = ctx.op as any;
      ctx.assert(op.user && op.client);
      if (error || out) {
        this.logger.error("internal device code flow error", error || out);
        return this.renderError(ctx as any, (out || error) as any);
      }
      const xsrf = op.session.state.secret;
      return this.renderDeviceFlow(ctx as any, ctx.oidc.params!.user_code || "", xsrf);
    });
  };

  private renderDeviceFlowConfirm: (ctx: ApplicationRequestContext, userCode: string, xsrf: string, device: DeviceInfo) => Promise<void> = async (ctx, userCode, xsrf, device) => {
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
    return this.wrapContext(ctx as any, () => {
      const op: ApplicationRequestContext["op"] = ctx.op as any;
      ctx.assert(op.user && op.client);
      op.device = device;
      const xsrf = op.session.state.secret;
      return this.renderDeviceFlowConfirm(ctx as any, userCode, xsrf, device);
    });
  };

  private renderDeviceFlowEnd: (ctx: ApplicationRequestContext) => Promise<void> = async (ctx) => {
    return ctx.op.render({
      name: "device_flow.end",
      actions: {},
    });
  };

  // ref: https://github.com/panva/node-oidc-provider/blob/ae8a4589c582b96f4e9ca0432307da15792ac29d/lib/actions/authorization/device_user_flow_response.js#L42
  private readonly deviceFlowSuccessSourceProxy: NonNullable<DeviceFlowConfiguration["successSource"]> = (ctx) => {
    return this.wrapContext(ctx as any, () => {
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

    // mount to app
    this.op.app.use(mount(compose([
      ...(this.appRenderer.routes ? this.appRenderer.routes() : []), // order matters for security's sake
      ...this.routerMiddleware,
      this.router.routes() as any,
    ])));

    // build federation configuration
    this.federation._dangerouslyBuild();
  }
}

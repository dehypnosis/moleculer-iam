import bodyParser from "koa-bodyparser";
import compose from "koa-compose";
import Router, { IMiddleware } from "koa-router";
import noCache from "koajs-nocache";
import { interactionPolicy } from "oidc-provider";
import { pascalCase } from "change-case";
import { IAMErrors } from "../../idp";
import { IAMServerRequestContext } from "../../server";
import { OIDCProviderContextProxy } from "./context";
import { OIDCError } from "./error.types";
import { IdentityFederationBuilder } from "./federation";
import { ApplicationRoutes, ApplicationRoutesFactory, ApplicationRequestContext } from "./app.types";
import { DeviceInfo } from "./proxy.types";
import { Logger } from "../../helper/logger";
import { I18N } from "../../helper/i18n";
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
      .use(this.routerMiddleware);

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
    (this.router as any)._setPrefix(prefix)
      .use(this.routerMiddleware); // re-apply middleware
    this.logger.info(`OIDC application route path configured:`, `${prefix}/:path`);
  }

  public get idp() {
    return this.builder.idp;
  }

  public get op() {
    return this.builder._dagerouslyGetProvider();
  }

  public readonly getURL = (path: string, withHost?: true) => `${withHost ? this.builder.issuer : ""}${this.prefix}${path}`;

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

      // normalize and translate error
      const { error, name, message, status, statusCode, code, status_code, error_description, expose, ...otherProps } = err;

      // set status
      let normalizedStatus = status || statusCode || code || status_code || 500;
      if (isNaN(normalizedStatus)) normalizedStatus = 500;
      ctx.status = normalizedStatus;

      const normalizedError = this.translateError(ctx, {
        error: pascalCase(error || name || "UnexpectedError"),
        error_description: error_description || message || "Unexpected error.",
        ...((expose || this.builder.dev) ? otherProps : {}),
      });

      return ctx.op.render("error", normalizedError);
    }
  };

  private readonly routerMiddleware = compose<any>([
    noCache(),
    bodyParser(),
    this.wrapContext,
    this.errorHandler,
  ]);

  private translateError(ctx: IAMServerRequestContext, error: OIDCError): OIDCError {
    const opts = {
      ns: "error",
      lng: ctx.locale.language,
    };
    error.error_description = I18N.translate(`${error.error}.description`, error.error_description, opts);
    error.error = I18N.translate(`${error.error}.name`, error.error, opts);

    // translate validation error data
    if (error.error === IAMErrors.ValidationError.name && error.data) {
      /* to translate validation error field labels, send request like..
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json;charset=UTF-8",
        "Payload-Labels": Buffer.from(JSON.stringify({
          "email": "이메일",
          "password": "패스워드",
          "nested.field": "...",
        }), "utf8").toString("base64"),
      },
      */
      let labels: any;
      try {
        const encodedLabels = ctx.request.get("Payload-Labels");
        if (encodedLabels) {
          labels = JSON.parse(Buffer.from(encodedLabels, "base64").toString("utf8"));
        }
      } catch (err) {
        this.logger.error(err);
      }
      for (const entry of error.data) {
        const { actual, expected, type, field } = entry;
        entry.message = I18N.translate(`${error.error}.data.${type}`, entry.message, {
          ...opts,
          // @ts-ignore
          actual,
          expected: (expected && type === "equalField" && labels && labels[expected]) || expected,
          field: (field && labels && labels[field]) || field,
        });
      }
    }

    return error;
  }

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

  public setRoutesFactory(factory: ApplicationRoutesFactory) {
    this._routesFactory = factory;
    return this;
  }

  public getRoutes(promptName?: string): ApplicationRoutes {
    if (!this._routesFactory) {
      this.logger.warn("routes factory not configured; which is to ensure available xhr/page request endpoints for each prompts");
      return {};
    }
    return this._routesFactory(promptName);
  }

  private _routesFactory?: ApplicationRoutesFactory;

  // internally named routes render default functions

  // ref: https://github.com/panva/node-oidc-provider/blob/74b434c627248c82ca9db5aed3a03f0acd0d7214/lib/shared/error_handler.js#L47
  private readonly renderErrorProxy: NonNullable<DynamicConfiguration["renderError"]> = (ctx, out, error) => {
    return this.wrapContext(ctx as any, () => {
      return this.errorHandler(ctx as any, () => {
        throw error;
      });
    });
  };

  private renderLogout: (ctx: ApplicationRequestContext, xsrf: string) => Promise<void> = async (ctx, xsrf) => {
    return ctx.op.render("logout", undefined, {
      // destroy sessions
      "logout.confirm": {
        url: ctx.op.getNamedURL("end_session_confirm"),
        method: "POST",
        payload: {
          xsrf,
          logout: "true",
        },
        synchronous: true,
      },
      // without session destroy
      "logout.redirect": {
        url: ctx.op.getNamedURL("end_session_confirm"),
        method: "POST",
        payload: {
          xsrf,
        },
        synchronous: true,
      },
    });
  };

  // ref: https://github.com/panva/node-oidc-provider/blob/e5ecd85c346761f1ac7a89b8bf174b873be09239/lib/actions/end_session.js#L89
  private readonly logoutSourceProxy: NonNullable<DynamicConfiguration["logoutSource"]> = (ctx) => {
    return this.wrapContext(ctx as any, () => {
      const op: ApplicationRequestContext["op"] = ctx.op as any;
      ctx.assert(op.user);

      const xsrf = op.session.state && op.session.state.secret;
      return this.renderLogout(ctx as any, xsrf);
    });
  };

  private renderLogoutEnd: (ctx: ApplicationRequestContext) => Promise<void> = async (ctx) => {
    return ctx.op.render("logout.end");
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
    return ctx.op.render("device_flow", undefined, {
      "device_flow.submit": {
        url: ctx.op.getNamedURL("code_verification"),
        method: "POST",
        payload: {
          xsrf,
          user_code: userCode,
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
        throw out || error;
      }
      const xsrf = op.session.state && op.session.state.secret;
      return this.renderDeviceFlow(ctx as any, ctx.oidc.params!.user_code || "", xsrf);
    });
  };

  private renderDeviceFlowConfirm: (ctx: ApplicationRequestContext, userCode: string, xsrf: string, device: DeviceInfo) => Promise<void> = async (ctx, userCode, xsrf, device) => {
    return ctx.op.render("device_flow.confirm", undefined, {
      "device_flow.verify": {
        url: ctx.op.getNamedURL("code_verification"),
        method: "POST",
        payload: {
          xsrf,
          user_code: userCode,
          confirm: "true",
        },
      },
      "device_flow.abort": {
        url: ctx.op.getNamedURL("code_verification"),
        method: "POST",
        payload: {
          xsrf,
          user_code: userCode,
          abort: "true",
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
      const xsrf = op.session.state && op.session.state.secret;
      return this.renderDeviceFlowConfirm(ctx as any, userCode, xsrf, device);
    });
  };

  private renderDeviceFlowEnd: (ctx: ApplicationRequestContext) => Promise<void> = async (ctx) => {
    return ctx.op.render("device_flow.end");
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

    // normalize oidc-provider original error for xhr error response, ref: https://github.com/panva/node-oidc-provider/blob/master/lib/shared/error_handler.js#L49
    this.op.app.middleware.unshift(async (ctx, next) => {
      await next();
      if (ctx.body && typeof ctx.body.error === "string") {
        ctx.body.error = pascalCase(ctx.body.error);
        ctx.body = { error: this.translateError(ctx as any, ctx.body as OIDCError) };
      }
    });

    // mount app renderer and app
    this.op.app.use(
      compose<any>([
        // apply additional "app renderer" middleware (like serving static files), order matters for security's sake
        ...(this.appRenderer.routes ? this.appRenderer.routes() : []),

        // apply "app router" middleware
        // this.router.allowedMethods(), // support "OPTIONS" methods
        this.router.routes(),
      ]),
    );

    // build federation configuration
    this.federation._dangerouslyBuild();
  }
}

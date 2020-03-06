"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const koa_bodyparser_1 = tslib_1.__importDefault(require("koa-bodyparser"));
const koa_compose_1 = tslib_1.__importDefault(require("koa-compose"));
const koa_mount_1 = tslib_1.__importDefault(require("koa-mount"));
const koa_router_1 = tslib_1.__importDefault(require("koa-router"));
const koajs_nocache_1 = tslib_1.__importDefault(require("koajs-nocache"));
const change_case_1 = require("change-case");
const context_1 = require("./context");
const federation_1 = require("./federation");
const renderer_1 = require("./renderer");
class ProviderApplicationBuilder {
    constructor(builder) {
        this.builder = builder;
        this._prefix = "/op";
        this.getURL = (path, withHost) => `${withHost ? this.builder.issuer : ""}${this.prefix}${path}`;
        this.wrapContext = async (ctx, next) => {
            ctx.idp = this.idp;
            ctx.op = await new context_1.OIDCProviderContextProxy(ctx, this.builder)._dangerouslyCreate();
            ctx.unwrap = () => {
                delete ctx.idp;
                delete ctx.op;
                delete ctx.locale;
                return ctx;
            };
            return next();
        };
        this.errorHandler = async (ctx, next) => {
            try {
                await next();
            }
            catch (err) {
                this.logger.error("app error", err);
                // normalize error
                const { error, name, message, status, statusCode, code, status_code, error_description, expose, ...otherProps } = err;
                let normalizedStatus = status || statusCode || code || status_code || 500;
                if (isNaN(normalizedStatus))
                    normalizedStatus = 500;
                const normalizedError = {
                    error: change_case_1.snakeCase(error || name),
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
                return ctx.op.render("error", normalizedError);
            }
        };
        this.routerMiddleware = [
            koajs_nocache_1.default(),
            koa_bodyparser_1.default(),
            this.wrapContext,
            this.errorHandler,
        ];
        // internally named routes render default functions
        this.renderError = async (ctx, error) => {
            return this.errorHandler(ctx, () => {
                throw error;
            });
        };
        // ref: https://github.com/panva/node-oidc-provider/blob/74b434c627248c82ca9db5aed3a03f0acd0d7214/lib/shared/error_handler.js#L47
        this.renderErrorProxy = (ctx, out, error) => {
            return this.wrapContext(ctx, () => {
                this.logger.error("internal render error", error);
                return this.renderError(ctx, out);
            });
        };
        this.renderLogout = async (ctx, xsrf) => {
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
        this.logoutSourceProxy = (ctx) => {
            return this.wrapContext(ctx, () => {
                const op = ctx.op;
                if (!op.user) {
                    return this.renderError(ctx, {
                        error: "invalid_request",
                        error_description: "Account session not exists.",
                    });
                }
                const xsrf = op.session.state && op.session.state.secret;
                return this.renderLogout(ctx, xsrf);
            });
        };
        this.renderLogoutEnd = async (ctx) => {
            return ctx.op.render("logout.end");
        };
        // ref: https://github.com/panva/node-oidc-provider/blob/e5ecd85c346761f1ac7a89b8bf174b873be09239/lib/actions/end_session.js#L272
        this.postLogoutSuccessSourceProxy = async (ctx) => {
            return this.wrapContext(ctx, async () => {
                const op = ctx.op;
                op.clientMetadata = await op.getPublicClientProps(ctx.oidc.client);
                return this.renderLogoutEnd(ctx);
            });
        };
        this.renderDeviceFlow = async (ctx, userCode, xsrf) => {
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
        this.deviceFlowUserCodeInputSourceProxy = (ctx, formHTML, out, error) => {
            return this.wrapContext(ctx, () => {
                const op = ctx.op;
                ctx.assert(op.user && op.client);
                if (error || out) {
                    this.logger.error("internal device code flow error", error || out);
                    return this.renderError(ctx, (out || error));
                }
                const xsrf = op.session.state && op.session.state.secret;
                return this.renderDeviceFlow(ctx, ctx.oidc.params.user_code || "", xsrf);
            });
        };
        this.renderDeviceFlowConfirm = async (ctx, userCode, xsrf, device) => {
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
        this.deviceFlowUserCodeConfirmSourceProxy = (ctx, formHTML, client, device, userCode) => {
            return this.wrapContext(ctx, () => {
                const op = ctx.op;
                ctx.assert(op.user && op.client);
                op.device = device;
                const xsrf = op.session.state && op.session.state.secret;
                return this.renderDeviceFlowConfirm(ctx, userCode, xsrf, device);
            });
        };
        this.renderDeviceFlowEnd = async (ctx) => {
            return ctx.op.render("device_flow.end");
        };
        // ref: https://github.com/panva/node-oidc-provider/blob/ae8a4589c582b96f4e9ca0432307da15792ac29d/lib/actions/authorization/device_user_flow_response.js#L42
        this.deviceFlowSuccessSourceProxy = (ctx) => {
            return this.wrapContext(ctx, () => {
                return this.renderDeviceFlowEnd(ctx);
            });
        };
        this._config = {
            url: (ctx, interaction) => {
                return `${this.prefix}/${interaction.prompt.name}`;
            },
            policy: [],
        };
        this.logger = builder.logger;
        // create router
        this.router = new koa_router_1.default({
            prefix: this.prefix,
            sensitive: true,
            strict: false,
        })
            .use(...this.routerMiddleware);
        this.router._setPrefix = this.router.prefix.bind(this.router);
        this.router.prefix = () => {
            this.logger.warn("rather call builder.setPrefix, it will not affect");
            return this.router;
        };
        // create federation builder
        this.federation = new federation_1.IdentityFederationBuilder(this.builder);
    }
    get prefix() {
        return this._prefix;
    }
    _dangerouslySetPrefix(prefix) {
        this.builder.assertBuilding();
        this._prefix = prefix;
        this.router._setPrefix(prefix).use(...this.routerMiddleware); // re-apply middleware
        this.logger.info(`OIDC application route path configured:`, `${prefix}/:path`);
    }
    get idp() {
        return this.builder.idp;
    }
    get op() {
        return this.builder._dagerouslyGetProvider();
    }
    // default render function
    setRendererFactory(factory, options) {
        this._appRenderer = factory({
            prefix: this.prefix,
            dev: this.builder.dev,
            logger: this.logger,
        }, options);
        return this;
    }
    get appRenderer() {
        if (!this._appRenderer) {
            this.setRendererFactory(renderer_1.dummyAppStateRendererFactory);
        }
        return this._appRenderer;
    }
    setRoutesFactory(factory) {
        this._routesFactory = factory;
        return this;
    }
    getRoutes(promptName) {
        if (!this._routesFactory) {
            this.logger.warn("routes factory not configured; which is to ensure available xhr/page request endpoints for each prompts");
            return {};
        }
        return this._routesFactory(promptName);
    }
    setPrompts(prompts) {
        this.builder.assertBuilding();
        this._config.policy.splice(0, this._config.policy.length, ...prompts);
        return this;
    }
    _dangerouslyGetDynamicConfiguration() {
        this.builder.assertBuilding();
        const { renderErrorProxy, logoutSourceProxy, postLogoutSuccessSourceProxy, deviceFlowUserCodeInputSourceProxy, deviceFlowUserCodeConfirmSourceProxy, deviceFlowSuccessSourceProxy, } = this;
        return {
            renderError: renderErrorProxy,
            logoutSource: logoutSourceProxy,
            interactions: this._config,
            postLogoutSuccessSource: postLogoutSuccessSourceProxy,
            features: {
                deviceFlow: {
                    userCodeInputSource: deviceFlowUserCodeInputSourceProxy,
                    userCodeConfirmSource: deviceFlowUserCodeConfirmSourceProxy,
                    successSource: deviceFlowSuccessSourceProxy,
                },
            },
        };
    }
    _dangerouslyBuild() {
        this.builder.assertBuilding();
        // mount to app
        this.op.app.use(koa_mount_1.default(koa_compose_1.default([
            ...(this.appRenderer.routes ? this.appRenderer.routes() : []),
            ...this.routerMiddleware,
            this.router.routes(),
        ])));
        // build federation configuration
        this.federation._dangerouslyBuild();
    }
}
exports.ProviderApplicationBuilder = ProviderApplicationBuilder;
//# sourceMappingURL=app.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const koa_bodyparser_1 = tslib_1.__importDefault(require("koa-bodyparser"));
const koa_compose_1 = tslib_1.__importDefault(require("koa-compose"));
const koa_mount_1 = tslib_1.__importDefault(require("koa-mount"));
const koa_router_1 = tslib_1.__importDefault(require("koa-router"));
const koajs_nocache_1 = tslib_1.__importDefault(require("koajs-nocache"));
// ref: https://github.com/panva/node-oidc-provider/blob/9306f66bdbcdff01400773f26539cf35951b9ce8/lib/models/client.js#L385
// @ts-ignore : need to hack oidc-provider private methods
const weak_cache_1 = tslib_1.__importDefault(require("oidc-provider/lib/helpers/weak_cache"));
// @ts-ignore : need to hack oidc-provider private methods
const session_1 = tslib_1.__importDefault(require("oidc-provider/lib/shared/session"));
class ProviderInteractionBuilder {
    constructor(props) {
        this.props = props;
        this._prefix = "/op";
        this.url = (path) => `${this.props.issuer}${this.prefix}${path}`;
        this.parseContext = async (ctx, next) => {
            // @ts-ignore ensure oidc context is created
            if (!ctx.oidc) {
                const OIDCContext = weak_cache_1.default(this.op).OIDCContext;
                Object.defineProperty(ctx, "oidc", { value: new OIDCContext(ctx) });
            }
            const session = await this.op.Session.get(ctx);
            ctx.op = {
                response: {
                    render: page => this.render(ctx, {
                        page,
                        session: session.state && session.state.custom || {},
                        locale: ctx.locale,
                        metadata: this.metadata,
                    }),
                    renderError: error => this.render(ctx, { error }),
                    redirect: async (url) => ctx.redirect(url),
                    updateSessionState: async (state) => {
                        const sessionState = await ctx.op.setSessionState(prevState => ({
                            ...prevState,
                            ...state,
                        }));
                        const response = { session: sessionState };
                        ctx.type = "json";
                        ctx.body = response;
                    },
                    updateInteractionResult: async (partialInteractionResult) => {
                        const mergedResult = { ...ctx.op.interaction.result, ...partialInteractionResult };
                        const redirectURL = await this.op.interactionResult(ctx.req, ctx.res, mergedResult, { mergeWithLastSubmission: true });
                        if (mergedResult.login) { // overwrite session account if need
                            await this.op.setProviderSession(ctx.req, ctx.res, mergedResult.login);
                        }
                        return ctx.op.response.redirect(redirectURL);
                    },
                },
                provider: this.op,
                session,
                setSessionState: async (fn) => {
                    if (!session.state) {
                        session.state = { custom: {} };
                    }
                    else if (!session.state.custom) {
                        session.state.custom = {};
                    }
                    session.state.custom = fn(session.state.custom);
                    await session_1.default(ctx, () => {
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
                namedUrl: (name, opts) => this.op.urlFor(name, opts),
                data: {},
                xsrf: session.state && session.state.secret || undefined,
            };
            ctx.idp = this.idp;
            // fetch interaction details
            try {
                const interaction = await this.op.interactionDetails(ctx.req, ctx.res);
                ctx.op.interaction = interaction;
                ctx.op.user = interaction.session && typeof interaction.session.accountId === "string" ? (await this.idp.findOrFail({ id: interaction.session.accountId })) : undefined;
                if (ctx.op.user) {
                    ctx.op.data.user = await this.getPublicUserProps(ctx.op.user);
                }
                ctx.op.client = interaction.params.client_id ? await this.op.Client.find(interaction.params.client_id) : undefined;
                if (ctx.op.client) {
                    ctx.op.data.client = await this.getPublicClientProps(ctx.op.client);
                }
            }
            catch (err) { }
            return next();
        };
        this.errorHandler = async (ctx, next) => {
            try {
                await next();
            }
            catch (err) {
                this.logger.error("interaction error", err);
                // normalize error
                const { error, name, message, status, statusCode, code, status_code, error_description, expose, ...otherProps } = err;
                let normalizedStatus = status || statusCode || code || status_code || 500;
                if (isNaN(normalizedStatus))
                    normalizedStatus = 500;
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
        this.commonMiddleware = [
            koajs_nocache_1.default(),
            koa_bodyparser_1.default(),
            this.parseContext,
            this.errorHandler,
        ];
        this.composed = [];
        this.render = async (ctx, response) => {
            this.logger.warn("interaction render function not configured");
            ctx.body = response;
        };
        // internally named routes render default functions
        this.renderError = async (ctx, error) => {
            return this.errorHandler(ctx, () => {
                throw error;
            });
        };
        // ref: https://github.com/panva/node-oidc-provider/blob/74b434c627248c82ca9db5aed3a03f0acd0d7214/lib/shared/error_handler.js#L47
        this.renderErrorProxy = (ctx, out, error) => {
            return this.parseContext(ctx, () => {
                this.logger.error("internal render error", error);
                return this.renderError(ctx, out);
            });
        };
        this.renderLogout = async (ctx, xsrf) => {
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
        this.logoutSourceProxy = (ctx) => {
            return this.parseContext(ctx, () => {
                ctx.assert(ctx.op.user);
                const xsrf = ctx.op.session.state.secret;
                return this.renderLogout(ctx, xsrf);
            });
        };
        this.renderLogoutEnd = async (ctx) => {
            return ctx.op.response.render({
                name: "logout.end",
                data: ctx.op.data,
            });
        };
        // ref: https://github.com/panva/node-oidc-provider/blob/e5ecd85c346761f1ac7a89b8bf174b873be09239/lib/actions/end_session.js#L272
        this.postLogoutSuccessSourceProxy = async (ctx) => {
            return this.parseContext(ctx, async () => {
                ctx.op.data.client = await this.getPublicClientProps(ctx.oidc.client);
                return this.renderLogoutEnd(ctx);
            });
        };
        this.renderDeviceFlow = async (ctx, userCode, xsrf) => {
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
        this.deviceFlowUserCodeInputSourceProxy = (ctx, formHTML, out, error) => {
            return this.parseContext(ctx, () => {
                ctx.assert(ctx.op.user && ctx.op.client);
                if (error || out) {
                    this.logger.error("internal device code flow error", error || out);
                    return this.renderError(ctx, (out || error));
                }
                const xsrf = ctx.op.session.state.secret;
                return this.renderDeviceFlow(ctx, ctx.oidc.params.user_code || "", xsrf);
            });
        };
        this.renderDeviceFlowConfirm = async (ctx, userCode, xsrf, device) => {
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
        this.deviceFlowUserCodeConfirmSourceProxy = (ctx, formHTML, client, device, userCode) => {
            return this.parseContext(ctx, () => {
                ctx.assert(ctx.op.user && ctx.op.client);
                ctx.op.data.device = device;
                const xsrf = ctx.op.session.state.secret;
                return this.renderDeviceFlowConfirm(ctx, userCode, xsrf, device);
            });
        };
        this.renderDeviceFlowEnd = async (ctx) => {
            return ctx.op.response.render({
                name: "device_flow.end",
                data: ctx.op.data,
            });
        };
        // ref: https://github.com/panva/node-oidc-provider/blob/ae8a4589c582b96f4e9ca0432307da15792ac29d/lib/actions/authorization/device_user_flow_response.js#L42
        this.deviceFlowSuccessSourceProxy = (ctx) => {
            return this.parseContext(ctx, () => {
                return this.renderDeviceFlowEnd(ctx);
            });
        };
        this.logger = props.logger;
        this.router = new koa_router_1.default({
            prefix: this.prefix,
            sensitive: true,
            strict: false,
        })
            .use(...this.commonMiddleware);
        this.setRouterPrefix = this.router.prefix.bind(this.router);
        this.router.prefix = () => {
            this.logger.warn("rather call builder.setPrefix, it will not affect");
            return this.router;
        };
    }
    get prefix() {
        return this._prefix;
    }
    _dangerouslySetPrefix(prefix) {
        this._prefix = prefix;
        this.setRouterPrefix(prefix).use(...this.commonMiddleware); // re-apply middleware
        this.logger.info(`interaction router path configured:`, `${prefix}/:routes`);
    }
    get op() {
        return this.props.getProvider();
    }
    get metadata() {
        return weak_cache_1.default(this.op).configuration().discovery;
    }
    get idp() {
        return this.props.idp;
    }
    use(...middleware) {
        this.composed.push(...middleware);
        return this;
    }
    build() {
        // compose middleware and mount routes to app
        this.op.app.use(koa_mount_1.default(koa_compose_1.default([
            ...this.composed,
            this.router.routes(),
        ])));
    }
    // default render function
    setRenderFunction(render) {
        this.render = render;
    }
    get namedRoutesProxy() {
        const { renderErrorProxy, logoutSourceProxy, postLogoutSuccessSourceProxy, deviceFlowUserCodeInputSourceProxy, deviceFlowUserCodeConfirmSourceProxy, deviceFlowSuccessSourceProxy, } = this;
        return {
            renderErrorProxy: renderErrorProxy,
            logoutSourceProxy: logoutSourceProxy,
            postLogoutSuccessSourceProxy: postLogoutSuccessSourceProxy,
            deviceFlowUserCodeInputSourceProxy: deviceFlowUserCodeInputSourceProxy,
            deviceFlowUserCodeConfirmSourceProxy: deviceFlowUserCodeConfirmSourceProxy,
            deviceFlowSuccessSourceProxy: deviceFlowSuccessSourceProxy,
        };
    }
    // utility
    async getPublicClientProps(client) {
        if (!client)
            return;
        return {
            id: client.clientId,
            name: client.clientName,
            logo_uri: client.logoUri,
            tos_uri: client.tosUri,
            policy_uri: client.policyUri,
            client_uri: client.clientUri,
        };
    }
    async getPublicUserProps(id) {
        if (!id)
            return;
        const { email, picture, name } = await id.claims("userinfo", "profile email");
        return {
            email,
            name: name || "unknown",
            picture,
        };
    }
}
exports.ProviderInteractionBuilder = ProviderInteractionBuilder;
//# sourceMappingURL=config.interaction.js.map
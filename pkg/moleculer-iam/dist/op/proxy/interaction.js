"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const koa_bodyparser_1 = tslib_1.__importDefault(require("koa-bodyparser"));
const koa_compose_1 = tslib_1.__importDefault(require("koa-compose"));
const koa_mount_1 = tslib_1.__importDefault(require("koa-mount"));
const koa_router_1 = tslib_1.__importDefault(require("koa-router"));
const koajs_nocache_1 = tslib_1.__importDefault(require("koajs-nocache"));
const federation_1 = require("./federation");
const renderer_1 = require("./renderer");
// ref: https://github.com/panva/node-oidc-provider/blob/9306f66bdbcdff01400773f26539cf35951b9ce8/lib/models/client.js#L385
// @ts-ignore : need to hack oidc-provider private methods
const weak_cache_1 = tslib_1.__importDefault(require("oidc-provider/lib/helpers/weak_cache"));
// @ts-ignore : need to hack oidc-provider private methods
const session_1 = tslib_1.__importDefault(require("oidc-provider/lib/shared/session"));
const JSON = "application/json";
const HTML = "text/html";
class ProviderInteractionBuilder {
    constructor(builder) {
        this.builder = builder;
        this._prefix = "/op";
        this.getURL = (path) => `${this.builder.issuer}${this.prefix}${path}`;
        this.parseContext = async (ctx, next) => {
            const { idp, op } = this;
            // @ts-ignore ensure oidc context is created
            if (!ctx.oidc) {
                const OIDCContext = weak_cache_1.default(op).OIDCContext;
                Object.defineProperty(ctx, "oidc", { value: new OIDCContext(ctx) });
            }
            const configuration = weak_cache_1.default(op).configuration();
            const session = await op.Session.get(ctx);
            const getURL = this.getURL;
            const getNamedURL = (name, opts) => op.urlFor(name, opts);
            const metadata = {
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
                discovery: configuration.discovery,
                xsrf: session.state && session.state.secret || undefined,
            };
            ctx.idp = idp;
            ctx.op = {
                render: async (page) => {
                    const response = {
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
                redirectWithUpdate: async (result, allowedPromptNames) => {
                    const interaction = ctx.op.interaction;
                    ctx.assert(interaction && (!allowedPromptNames || allowedPromptNames.includes(interaction.prompt.name)));
                    const mergedResult = { ...ctx.op.interaction.result, ...result };
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
                    const response = session.touched
                        ? { state: session.state && session.state.custom || {} }
                        : {};
                    ctx.type = JSON;
                    ctx.body = response;
                },
                assertPrompt: (allowedPromptNames, message) => {
                    const interaction = ctx.op.interaction;
                    ctx.assert(interaction && (!allowedPromptNames || allowedPromptNames.includes(interaction.prompt.name)), 400, message || "invalid_request");
                },
                session: session,
                setSessionState: async (update) => {
                    if (!session.state) {
                        session.state = { custom: {} };
                    }
                    else if (!session.state.custom) {
                        session.state.custom = {};
                    }
                    session.state.custom = update(session.state.custom);
                    await session_1.default(ctx, () => {
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
                    const interaction = await op.interactionDetails(ctx.req, ctx.res);
                    ctx.op.interaction = interaction;
                    ctx.op.user = interaction.session && typeof interaction.session.accountId === "string" ? (await idp.findOrFail({ id: interaction.session.accountId })) : undefined;
                    if (ctx.op.user) {
                        ctx.op.metadata.user = await this.getPublicUserProps(ctx.op.user);
                    }
                    ctx.op.client = interaction.params.client_id ? await op.Client.find(interaction.params.client_id) : undefined;
                    if (ctx.op.client) {
                        ctx.op.metadata.client = await this.getPublicClientProps(ctx.op.client);
                    }
                }
                catch (err) { }
            };
            await fetchInteractionDetails();
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
        this.commonMiddleware = [
            koajs_nocache_1.default(),
            koa_bodyparser_1.default(),
            this.parseContext,
            this.errorHandler,
        ];
        this.middleware = [];
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
        this.logoutSourceProxy = (ctx) => {
            const op = ctx.op;
            return this.parseContext(ctx, () => {
                ctx.assert(op.user);
                const xsrf = op.session.state.secret;
                return this.renderLogout(ctx, xsrf);
            });
        };
        this.renderLogoutEnd = async (ctx) => {
            return ctx.op.render({
                name: "logout.end",
            });
        };
        // ref: https://github.com/panva/node-oidc-provider/blob/e5ecd85c346761f1ac7a89b8bf174b873be09239/lib/actions/end_session.js#L272
        this.postLogoutSuccessSourceProxy = async (ctx) => {
            const op = ctx.op;
            return this.parseContext(ctx, async () => {
                op.metadata.client = await this.getPublicClientProps(ctx.oidc.client);
                return this.renderLogoutEnd(ctx);
            });
        };
        this.renderDeviceFlow = async (ctx, userCode, xsrf) => {
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
        this.deviceFlowUserCodeInputSourceProxy = (ctx, formHTML, out, error) => {
            const op = ctx.op;
            return this.parseContext(ctx, () => {
                ctx.assert(op.user && op.client);
                if (error || out) {
                    this.logger.error("internal device code flow error", error || out);
                    return this.renderError(ctx, (out || error));
                }
                const xsrf = op.session.state.secret;
                return this.renderDeviceFlow(ctx, ctx.oidc.params.user_code || "", xsrf);
            });
        };
        this.renderDeviceFlowConfirm = async (ctx, userCode, xsrf, device) => {
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
        this.deviceFlowUserCodeConfirmSourceProxy = (ctx, formHTML, client, device, userCode) => {
            const op = ctx.op;
            return this.parseContext(ctx, () => {
                ctx.assert(op.user && op.client);
                op.metadata.device = device;
                const xsrf = op.session.state.secret;
                return this.renderDeviceFlowConfirm(ctx, userCode, xsrf, device);
            });
        };
        this.renderDeviceFlowEnd = async (ctx) => {
            return ctx.op.render({
                name: "device_flow.end",
            });
        };
        // ref: https://github.com/panva/node-oidc-provider/blob/ae8a4589c582b96f4e9ca0432307da15792ac29d/lib/actions/authorization/device_user_flow_response.js#L42
        this.deviceFlowSuccessSourceProxy = (ctx) => {
            return this.parseContext(ctx, () => {
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
            .use(...this.commonMiddleware);
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
        this.router._setPrefix(prefix).use(...this.commonMiddleware); // re-apply middleware
        this.logger.info(`interaction route path configured:`, `${prefix}/:path`);
    }
    get idp() {
        return this.builder.idp;
    }
    get op() {
        return this.builder._dagerouslyGetProvider();
    }
    use(...middleware) {
        this.builder.assertBuilding();
        this.middleware.push(...middleware);
        return this;
    }
    // default render function
    setPageRenderer(factory, options) {
        this._pageRenderer = factory({
            prefix: this.prefix,
            dev: this.builder.dev,
            logger: this.logger,
        }, options);
        return this;
    }
    get pageRenderer() {
        if (!this._pageRenderer) {
            this.setPageRenderer(renderer_1.dummyInteractionPageRendererFactory);
        }
        return this._pageRenderer;
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
        // add middleware
        const composed = [
            ...this.middleware,
        ];
        // add page renderer optional routes
        if (this.pageRenderer.routes) {
            composed.push(...this.pageRenderer.routes());
        }
        // add interaction routes
        composed.push(this.router.routes());
        // mount to app
        this.op.app.use(koa_mount_1.default(koa_compose_1.default(composed)));
        // build federation configuration
        this.federation._dangerouslyBuild();
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
//# sourceMappingURL=interaction.js.map
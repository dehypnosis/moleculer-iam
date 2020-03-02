"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const _ = tslib_1.__importStar(require("lodash"));
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
        this.parseContext = async (ctx, next) => {
            // @ts-ignore ensure oidc context is created
            if (!ctx.oidc) {
                const OIDCContext = weak_cache_1.default(this.op).OIDCContext;
                Object.defineProperty(ctx, "oidc", { value: new OIDCContext(ctx) });
            }
            const session = await this.op.Session.get(ctx);
            ctx.op = {
                provider: this.op,
                render: (state) => {
                    const mergedState = {
                        ...state,
                        locale: ctx.locale,
                        metadata: this.metadata,
                    };
                    return this.render(ctx, mergedState);
                },
                session,
                setSessionState: async (state) => {
                    session.state = _.defaultsDeep(state, session.state);
                    await session_1.default(ctx, () => {
                        // @ts-ignore
                        ctx.oidc.session.touched = true;
                    });
                    await session.save();
                    // @ts-ignore
                    delete session.touched;
                },
                url: (path) => `${this.op.issuer}/interaction/${path}`,
                namedUrl: ctx.oidc.urlFor,
                data: {},
            };
            if (session.state && session.state.secret) {
                ctx.op.xsrf = session.state.secret;
            }
            ctx.idp = this.idp;
            // fetch interaction details
            try {
                const interaction = await this.op.interactionDetails(ctx.req, ctx.res);
                ctx.op.interaction = interaction;
                ctx.op.setInteractionResult = async (result) => {
                    const mergedResult = { ...ctx.op.interaction, ...result };
                    const redirect = await this.op.interactionResult(ctx.req, ctx.res, mergedResult, { mergeWithLastSubmission: true });
                    if (mergedResult.login) { // overwrite session account if need
                        await this.op.setProviderSession(ctx.req, ctx.res, mergedResult.login);
                    }
                    return redirect;
                };
                ctx.op.user = interaction.session && typeof interaction.session.accountId === "string" ? (await this.idp.findOrFail({ id: interaction.session.accountId })) : undefined;
                if (ctx.op.user) {
                    ctx.op.data.user = this.getPublicUserProps(ctx.op.user);
                }
                ctx.op.client = interaction.params.client_id ? await this.op.Client.find(interaction.params.client_id) : undefined;
                if (ctx.op.client) {
                    ctx.op.data.client = this.getPublicClientProps(ctx.op.client);
                }
            }
            catch (err) { }
            return next();
        };
        this.commonMiddleware = [
            koajs_nocache_1.default(),
            koa_bodyparser_1.default(),
            this.parseContext,
        ];
        this.composed = [];
        this.render = async (ctx, state) => {
            this.props.logger.warn("interaction render function not configured");
            ctx.body = state;
        };
        // internally named routes render default functions
        this.renderError = async (ctx, error) => {
            return ctx.op.render({ error });
        };
        // ref: https://github.com/panva/node-oidc-provider/blob/74b434c627248c82ca9db5aed3a03f0acd0d7214/lib/shared/error_handler.js#L47
        this.renderErrorProxy = (ctx, out, error) => {
            return this.parseContext(ctx, () => {
                this.props.logger.error("internal render error", error);
                return this.renderError(ctx, out);
            });
        };
        this.renderLogout = async (ctx, xsrf) => {
            return ctx.op.render({
                interaction: {
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
            return ctx.op.render({
                interaction: {
                    name: "logout.end",
                    data: ctx.op.data,
                },
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
            return ctx.op.render({
                interaction: {
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
                },
            });
        };
        // ref: https://github.com/panva/node-oidc-provider/blob/74b434c627248c82ca9db5aed3a03f0acd0d7214/lib/actions/code_verification.js#L38
        this.deviceFlowUserCodeInputSourceProxy = (ctx, formHTML, out, error) => {
            return this.parseContext(ctx, () => {
                ctx.assert(ctx.op.user && ctx.op.client);
                if (error || out) {
                    this.props.logger.error("internal device code flow error", error || out);
                    return this.renderError(ctx, (out || error));
                }
                const xsrf = ctx.op.session.state.secret;
                return this.renderDeviceFlow(ctx, ctx.oidc.params.user_code || "", xsrf);
            });
        };
        this.renderDeviceFlowConfirm = async (ctx, userCode, xsrf, device) => {
            return ctx.op.render({
                interaction: {
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
                }
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
            return ctx.op.render({
                interaction: {
                    name: "device_flow.end",
                    data: ctx.op.data,
                },
            });
        };
        // ref: https://github.com/panva/node-oidc-provider/blob/ae8a4589c582b96f4e9ca0432307da15792ac29d/lib/actions/authorization/device_user_flow_response.js#L42
        this.deviceFlowSuccessSourceProxy = (ctx) => {
            return this.parseContext(ctx, () => {
                return this.renderDeviceFlowEnd(ctx);
            });
        };
        this.router = new koa_router_1.default({
            prefix: "/op",
            sensitive: true,
            strict: false,
        })
            .use(...this.commonMiddleware);
        const originalPrefix = this.router.prefix.bind(this.router);
        this.router.prefix = (prefix) => {
            return originalPrefix(prefix)
                .use(...this.commonMiddleware);
        };
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
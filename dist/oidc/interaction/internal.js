"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const util_1 = require("./util");
class InternalInteractionConfigurationFactory {
    constructor(props) {
        this.props = props;
    }
    configuration() {
        const idp = this.props.idp;
        const logger = this.props.logger;
        const render = this.render.bind(this);
        function getContext(ctx) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                const oidc = ctx.oidc;
                // fetch identity and client
                const user = oidc.session ? yield idp.findOrFail({ id: oidc.session.accountId() }) : undefined;
                const clientId = oidc.session.state.clientId;
                const client = clientId ? (yield oidc.provider.Client.find(clientId)) : undefined;
                return { user, client };
            });
        }
        return {
            /* error */
            renderError(ctx, out, error) {
                return tslib_1.__awaiter(this, void 0, void 0, function* () {
                    logger.error(error);
                    ctx.type = "json";
                    ctx.body = out;
                });
            },
            /* logout */
            // signed out without post_logout_redirect_uri params
            postLogoutSuccessSource(ctx) {
                return tslib_1.__awaiter(this, void 0, void 0, function* () {
                    ctx.type = "json";
                    ctx.body = null;
                });
            },
            // sign out
            // ref: https://github.com/panva/node-oidc-provider/blob/c6b1770e68224b7463c1fa5c64199f0cd38131af/lib/actions/end_session.js#L88
            logoutSource(ctx, formHTML) {
                return tslib_1.__awaiter(this, void 0, void 0, function* () {
                    const { user, client } = yield getContext(ctx);
                    ctx.assert(user);
                    yield render(ctx, {
                        interaction: "logout",
                        data: {
                            user: user ? yield util_1.getPublicUserProps(user) : undefined,
                            client: client ? yield util_1.getPublicClientProps(client) : undefined,
                        },
                        action: {
                            submit: {
                                url: ctx.oidc.urlFor("end_session_confirm"),
                                method: "POST",
                                data: {
                                    logout: true,
                                },
                                urlencoded: true,
                            },
                        },
                    });
                });
            },
            features: {
                deviceFlow: {
                    /* device flow */
                    // prompt user code for device flow
                    // ref: https://github.com/panva/node-oidc-provider/blob/74b434c627248c82ca9db5aed3a03f0acd0d7214/lib/actions/code_verification.js#L19
                    userCodeInputSource(ctx, formHTML, out, error) {
                        return tslib_1.__awaiter(this, void 0, void 0, function* () {
                            const { user, client } = yield getContext(ctx);
                            ctx.assert(user && client);
                            const oidc = ctx.oidc;
                            yield render(ctx, error || {
                                error,
                                interaction: "device_code_verification",
                                data: {
                                    user: user ? yield util_1.getPublicUserProps(user) : undefined,
                                    client: client ? yield util_1.getPublicClientProps(client) : undefined,
                                },
                                action: {
                                    submit: {
                                        url: oidc.urlFor("code_verification"),
                                        method: "POST",
                                        data: {
                                            user_code: oidc.params.user_code || "",
                                        },
                                    },
                                },
                            });
                        });
                    },
                    // confirm user code
                    // ref: https://github.com/panva/node-oidc-provider/blob/master/lib/helpers/defaults.js#L635
                    userCodeConfirmSource(ctx, form, client, deviceInfo, userCode) {
                        return tslib_1.__awaiter(this, void 0, void 0, function* () {
                            const { user } = yield getContext(ctx);
                            ctx.assert(user && client);
                            const oidc = ctx.oidc;
                            yield render(ctx, {
                                interaction: "device_code_verification_end",
                                action: {
                                    submit: {
                                        url: oidc.urlFor("code_verification"),
                                        method: "POST",
                                        data: {
                                            user_code: userCode,
                                            confirm: true,
                                        },
                                    },
                                    abort: {
                                        url: oidc.urlFor("code_verification"),
                                        method: "POST",
                                        data: {
                                            user_code: userCode,
                                            abort: true,
                                        },
                                    },
                                },
                                data: {
                                    user: user ? yield util_1.getPublicUserProps(user) : undefined,
                                    client: client ? yield util_1.getPublicClientProps(client) : undefined,
                                    deviceInfo,
                                },
                            });
                        });
                    },
                    // user code confirmed
                    successSource(ctx) {
                        return tslib_1.__awaiter(this, void 0, void 0, function* () {
                            const { user, client } = yield getContext(ctx);
                            ctx.assert(user && client);
                            yield render(ctx, {
                                interaction: "device_code_verification_complete",
                                // TODO: add details for to determine confirmed or non-confirmed
                                data: {
                                    user: user ? yield util_1.getPublicUserProps(user) : undefined,
                                    client: client ? yield util_1.getPublicClientProps(client) : undefined,
                                },
                            });
                        });
                    },
                },
            },
        };
    }
    render(ctx, props) {
        // fill XSRF token
        if (props && props.action) {
            ctx = ctx;
            const oidc = (ctx.oidc || {});
            const xsrf = oidc.session && oidc.session.state && oidc.session.state.secret || undefined;
            if (xsrf) {
                // tslint:disable-next-line:forin
                for (const k in props.action) {
                    const action = props.action[k];
                    (action.data = action.data || {}).xsrf = xsrf;
                }
            }
        }
        ctx.type = "json";
        ctx.body = props;
    }
}
exports.InternalInteractionConfigurationFactory = InternalInteractionConfigurationFactory;
//# sourceMappingURL=internal.js.map
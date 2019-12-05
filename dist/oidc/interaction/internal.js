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
        const render = this.render.bind(this);
        const logger = this.props.logger;
        return {
            /* error */
            renderError(ctx, out, error) {
                return tslib_1.__awaiter(this, void 0, void 0, function* () {
                    yield render(ctx, {
                        error,
                    });
                });
            },
            /* logout */
            // signed out without post_logout_redirect_uri params
            postLogoutSuccessSource(ctx) {
                return tslib_1.__awaiter(this, void 0, void 0, function* () {
                    const oidc = ctx.oidc;
                    yield render(ctx, {
                        interaction: {
                            name: "logout_end",
                        },
                    });
                });
            },
            // sign out
            // ref: https://github.com/panva/node-oidc-provider/blob/c6b1770e68224b7463c1fa5c64199f0cd38131af/lib/actions/end_session.js#L88
            logoutSource(ctx, formHTML) {
                return tslib_1.__awaiter(this, void 0, void 0, function* () {
                    const oidc = ctx.oidc;
                    const id = yield idp.find(oidc.session.accountId());
                    ctx.assert(id);
                    const clientId = oidc.session.state.clientId;
                    const client = clientId ? (yield oidc.provider.Client.find(clientId)) : null;
                    const { email, preferred_username, nickname, name } = yield id.claims("id_token", "profile email");
                    yield render(ctx, {
                        interaction: {
                            name: "logout",
                            action: {
                                submit: {
                                    url: oidc.urlFor("end_session_confirm"),
                                    method: "POST",
                                    data: {
                                        logout: true,
                                    },
                                },
                            },
                            data: {
                                email,
                                name: preferred_username || nickname || name,
                                client: util_1.getPublicClientProps(client),
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
                            const oidc = ctx.oidc;
                            yield render(ctx, {
                                error,
                                interaction: {
                                    name: "device_flow_code_verification",
                                    action: {
                                        submit: {
                                            url: oidc.urlFor("code_verification"),
                                            method: "POST",
                                            data: {
                                                user_code: oidc.params.user_code || "",
                                            },
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
                            const oidc = ctx.oidc;
                            yield render(ctx, {
                                interaction: {
                                    name: "device_flow_confirm",
                                    data: {
                                        deviceInfo,
                                    },
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
                                },
                            });
                        });
                    },
                    // user code confirmed
                    successSource(ctx) {
                        return tslib_1.__awaiter(this, void 0, void 0, function* () {
                            yield render(ctx, {
                                interaction: {
                                    name: "device_flow_end",
                                },
                            });
                        });
                    },
                },
            },
        };
    }
    render(ctx, props) {
        ctx = ctx;
        const oidc = (ctx.oidc || {});
        // const context: ClientApplicationContext = {
        //   account_id: session && session.account || null,
        //   client: getPublicClientProps(client),
        //   prompt: {
        //     name: route,
        //     details: {},
        //     reasons: [],
        //   },
        //   params: _.mapValues(params || {}, value => typeof value === "undefined" ? null : value),
        // };
        // fill XSRF token for POST actions
        if (props.interaction && props.interaction.action) {
            const xsrf = oidc.session && oidc.session.state && oidc.session.state.secret || undefined;
            if (xsrf) {
                // tslint:disable-next-line:forin
                for (const k in props.interaction.action) {
                    const action = props.interaction.action[k];
                    if (action.method === "POST") {
                        action.data.xsrf = xsrf;
                    }
                }
            }
        }
        return this.props.renderer.render(ctx, props);
    }
}
exports.InternalInteractionConfigurationFactory = InternalInteractionConfigurationFactory;
//# sourceMappingURL=internal.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const util_1 = require("./util"); // TODO
// @ts-ignore : need to hack oidc-provider private methods
const weak_cache_1 = tslib_1.__importDefault(require("oidc-provider/lib/helpers/weak_cache"));
class InternalInteractionConfigurationFactory {
    constructor(props) {
        this.props = props;
        this.render = (ctx, props) => {
            ctx = ctx;
            const oidc = (ctx.oidc || {});
            // fill XSRF token
            if (props && props.interaction) {
                const xsrf = oidc.session && oidc.session.state && oidc.session.state.secret || undefined;
                if (xsrf) {
                    // tslint:disable-next-line:forin
                    for (const k in props.interaction.actions) {
                        const action = props.interaction.actions[k];
                        (action.payload = action.payload || {}).xsrf = xsrf;
                    }
                }
            }
            // get metadata
            const metadata = oidc.provider && weak_cache_1.default(oidc.provider).configuration().discovery || {};
            return this.props.renderer.render(ctx, { metadata, ...props });
        };
    }
    configuration() {
        const idp = this.props.idp;
        const logger = this.props.logger;
        const render = this.render.bind(this);
        async function getContext(ctx) {
            const oidc = ctx.oidc;
            // fetch identity and client
            const user = oidc.session ? await idp.findOrFail({ id: oidc.session.accountId() }) : undefined;
            const clientId = oidc.session.state.clientId;
            const client = clientId ? (await oidc.provider.Client.find(clientId)) : undefined;
            return { user, client };
        }
        return {
            async renderError(ctx, out, error) {
                logger.error(error);
                return render(ctx, { error: out });
            },
            // signed out without post_logout_redirect_uri params
            async postLogoutSuccessSource(ctx) {
                return render(ctx, {
                    interaction: {
                        name: "logout",
                    },
                });
            },
            // sign out
            // ref: https://github.com/panva/node-oidc-provider/blob/c6b1770e68224b7463c1fa5c64199f0cd38131af/lib/actions/end_session.js#L88
            async logoutSource(ctx, formHTML) {
                const { user, client } = await getContext(ctx);
                ctx.assert(user);
                await render(ctx, {
                    interaction: {
                        name: "logout",
                        data: {
                            user: await util_1.getPublicUserProps(user),
                            client: await util_1.getPublicClientProps(client),
                        },
                        actions: {
                            "logout.confirm": {
                                url: ctx.oidc.urlFor("end_session_confirm"),
                                method: "POST",
                                payload: {
                                    logout: "true",
                                },
                                urlencoded: true,
                            },
                        },
                    },
                });
            },
            features: {
                deviceFlow: {
                    /* device flow */
                    // prompt user code for device flow
                    // ref: https://github.com/panva/node-oidc-provider/blob/74b434c627248c82ca9db5aed3a03f0acd0d7214/lib/actions/code_verification.js#L19
                    async userCodeInputSource(ctx, formHTML, out, error) {
                        const { user, client } = await getContext(ctx);
                        ctx.assert(user && client);
                        await render(ctx, {
                            error,
                            interaction: error ? undefined : {
                                name: "device_code_verification",
                                data: {
                                    user: await util_1.getPublicUserProps(user),
                                    client: await util_1.getPublicClientProps(client),
                                },
                                actions: {
                                    submit: {
                                        url: ctx.oidc.urlFor("code_verification"),
                                        method: "POST",
                                        payload: {
                                            user_code: ctx.oidc.params.user_code || "",
                                        },
                                    },
                                },
                            },
                        });
                    },
                    // confirm user code
                    // ref: https://github.com/panva/node-oidc-provider/blob/master/lib/helpers/defaults.js#L635
                    // tslint:disable-next-line:variable-name
                    async userCodeConfirmSource(ctx, form, client, device, user_code) {
                        const { user } = await getContext(ctx);
                        ctx.assert(user && client);
                        await render(ctx, {
                            interaction: {
                                name: "device_code_verification",
                                data: {
                                    user: await util_1.getPublicUserProps(user),
                                    client: await util_1.getPublicClientProps(client),
                                    device,
                                },
                                actions: {
                                    verify: {
                                        url: ctx.oidc.urlFor("code_verification"),
                                        method: "POST",
                                        payload: {
                                            user_code,
                                            confirm: "true",
                                        },
                                    },
                                    abort: {
                                        url: ctx.oidc.urlFor("code_verification"),
                                        method: "POST",
                                        payload: {
                                            user_code,
                                            abort: "true",
                                        },
                                    },
                                },
                            }
                        });
                    },
                    // user code confirmed
                    async successSource(ctx) {
                        const { user, client } = await getContext(ctx);
                        ctx.assert(user && client);
                        await render(ctx, {
                            interaction: {
                                name: "device_code_verification",
                                // TODO: add details for to determine confirmed or non-confirmed
                                data: {
                                    user: await util_1.getPublicUserProps(user),
                                    client: await util_1.getPublicClientProps(client),
                                },
                            },
                        });
                    },
                },
            },
        };
    }
}
exports.InternalInteractionConfigurationFactory = InternalInteractionConfigurationFactory;
//# sourceMappingURL=interaction.internal.js.map
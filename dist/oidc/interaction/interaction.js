"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const koa_router_1 = tslib_1.__importDefault(require("koa-router"));
const koa_bodyparser_1 = tslib_1.__importDefault(require("koa-bodyparser"));
const koajs_nocache_1 = tslib_1.__importDefault(require("koajs-nocache"));
const fastest_validator_1 = tslib_1.__importDefault(require("fastest-validator"));
const provider_1 = require("../provider");
const util_1 = require("./util");
class InteractionFactory {
    constructor(props) {
        this.props = props;
        // create router
        this.router = new koa_router_1.default({
            prefix: "/interaction",
            sensitive: true,
            strict: false,
        });
        // apply router middleware
        this.router.use(koajs_nocache_1.default(), koa_bodyparser_1.default());
        // create validator
        this.validator = new fastest_validator_1.default();
    }
    // validate body with given schema then throw error on error
    validate(ctx, schema) {
        const errors = this.validator.validate(ctx.request.body, schema);
        if (errors !== true && errors.length > 0) {
            const error = {
                name: "validation_failed",
                message: "Failed to validate request params.",
                status: 422,
                detail: errors.reduce((fields, err) => {
                    if (!fields[err.field])
                        fields[err.field] = [];
                    const { field, message } = err;
                    fields[field].push(message);
                    return fields;
                }, {}),
            };
            throw error;
        }
    }
    interactions() {
        const { Prompt, Check, base } = provider_1.interactionPolicy;
        const defaultPrompts = base();
        return {
            url(ctx, interaction) {
                return tslib_1.__awaiter(this, void 0, void 0, function* () {
                    return `/interaction/${interaction.prompt.name}`;
                });
            },
            policy: [
                // can modify policy and add prompt like: MFA, captcha, ...
                defaultPrompts.get("login"),
                defaultPrompts.get("consent"),
            ],
        };
    }
    /* create interaction routes */
    routes(provider) {
        function url(path) {
            return `${provider.issuer}/interaction${path}`;
        }
        const { idp, renderer, logger } = this.props;
        const router = this.router;
        const validate = this.validate.bind(this);
        const render = renderer.render.bind(renderer);
        // static action endpoints
        const actions = {
            abort: {
                url: url(`/abort`),
                method: "POST",
                data: {},
            },
            changeAccount: {
                url: url(`/login`),
                method: "GET",
                data: {
                    change: true,
                },
                urlencoded: true,
            },
            federate: {
                url: url(`/federate`),
                method: "POST",
                data: {
                    provider: "",
                },
                urlencoded: true,
            },
            /* sub interactions for login */
            findEmail: {
                url: url(`/find-email`),
                method: "POST",
            },
            resetPassword: {
                url: url(`/reset-password`),
                method: "POST",
            },
            register: {
                url: url(`/register`),
                method: "POST",
            },
        };
        // middleware
        router.use((ctx, next) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                // fetch interaction details
                const interaction = yield provider.interactionDetails(ctx.req, ctx.res);
                // fetch identity and client
                const user = interaction.session ? (yield idp.find(interaction.session.accountId)) : undefined;
                const client = interaction.params.client_id ? (yield provider.Client.find(interaction.params.client_id)) : undefined;
                const locals = { interaction, user, client };
                ctx.locals = locals;
                yield next();
            }
            catch (error) {
                if (error.status >= 500) {
                    logger.error(error);
                }
                // delegate error handling
                return render(ctx, { error });
            }
        }));
        // abort interactions
        router.post("/abort", (ctx) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const redirect = yield provider.interactionResult(ctx.req, ctx.res, {
                error: "access_denied",
                error_description: "end-user aborted interaction",
            }, {
                mergeWithLastSubmission: false,
            });
            return render(ctx, {
                redirect,
            });
        }));
        // handle login
        router.get("/login", (ctx) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { user, client, interaction } = ctx.locals;
            // already signed in
            if (user && interaction.prompt.name !== "login" && !ctx.request.query.change) {
                const redirect = yield provider.interactionResult(ctx.req, ctx.res, {
                    // authentication/login prompt got resolved, omit if no authentication happened, i.e. the user
                    // cancelled
                    login: {
                        account: user.id,
                        remember: true,
                    },
                }, {
                    mergeWithLastSubmission: true,
                });
                return render(ctx, { redirect });
            }
            return render(ctx, {
                interaction: {
                    name: "login",
                    action: Object.assign({ submit: {
                            url: url(`/login`),
                            method: "POST",
                            data: {
                                email: interaction.params.login_hint || "",
                            },
                        } }, actions),
                    data: {
                        user: user && !ctx.request.query.change ? yield util_1.getPublicUserProps(user) : undefined,
                        client: client ? yield util_1.getPublicClientProps(client) : undefined,
                    },
                },
            });
        }));
        router.post("/login", (ctx) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { client, interaction } = ctx.locals;
            const { email, password } = ctx.request.body;
            // 1. user enter email only
            if (typeof password === "undefined") {
                // 2. server validate email
                validate(ctx, { email: "email" });
                // 3. fetch identity
                // tslint:disable-next-line:no-shadowed-variable
                const user = yield idp.findByEmail(email);
                return render(ctx, {
                    interaction: {
                        name: "login",
                        action: Object.assign({ submit: {
                                url: url(`/login`),
                                method: "POST",
                                data: {
                                    email,
                                    password: "",
                                },
                            } }, actions),
                        data: {
                            user: user ? yield util_1.getPublicUserProps(user) : undefined,
                            client: client ? yield util_1.getPublicClientProps(client) : undefined,
                        },
                    },
                });
            }
            // 4. user get the next page and enter password and server validate it
            validate(ctx, {
                email: "email",
                password: "string|empty:false",
            });
            // 5. check account password
            const user = yield idp.findByEmail(email);
            yield idp.assertCredentials(user, { password });
            // 6. finish interaction and give redirection uri
            const login = {
                account: user.id,
                remember: true,
            };
            const redirect = yield provider.interactionResult(ctx.req, ctx.res, {
                // authentication/login prompt got resolved, omit if no authentication happened, i.e. the user
                // cancelled
                login,
            }, {
                mergeWithLastSubmission: true,
            });
            // overwrite session for consent -> change account -> login
            yield provider.setProviderSession(ctx.req, ctx.res, login);
            return render(ctx, { redirect });
        }));
        // handle consent
        router.get("/consent", (ctx) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { user, client, interaction } = ctx.locals;
            ctx.assert(interaction.prompt.name === "consent", "Invalid Request");
            const data = {
                user: user ? yield util_1.getPublicUserProps(user) : undefined,
                client: client ? yield util_1.getPublicClientProps(client) : undefined,
            };
            return render(ctx, {
                interaction: {
                    name: "consent",
                    action: Object.assign({ submit: {
                            url: url(`/consent`),
                            method: "POST",
                            data: {
                                rejectedScopes: [],
                                rejectedClaims: [],
                            },
                        } }, actions),
                    data: Object.assign(Object.assign({}, data), { 
                        // consent data (scopes, claims)
                        consent: interaction.prompt.details }),
                },
            });
        }));
        router.post("/consent", (ctx) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { user, client, interaction } = ctx.locals;
            ctx.assert(interaction.prompt.name === "consent");
            // 1. validate body
            validate(ctx, {
                rejectedScopes: {
                    type: "array",
                    items: "string",
                },
                rejectedClaims: {
                    type: "array",
                    items: "string",
                },
            });
            // 2. finish interaction and give redirection uri
            const redirect = yield provider.interactionResult(ctx.req, ctx.res, {
                // consent was given by the user to the client for this session
                consent: ctx.request.body,
            }, {
                mergeWithLastSubmission: true,
            });
            return render(ctx, { redirect });
        }));
        // handle find-email submit
        router.post("/find-email", (ctx) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { user, client, interaction } = ctx.locals;
            ctx.assert(interaction.prompt.name === "login" || interaction.prompt.name === "consent", "Invalid Request");
            // extend TTL
            yield interaction.save(60 * 10);
        }));
        // handle register submit
        router.post("/register", (ctx) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { user, client, interaction } = ctx.locals;
            ctx.assert(interaction.prompt.name === "login" || interaction.prompt.name === "consent", "Invalid Request");
            // extend TTL
            yield interaction.save(60 * 10);
            return render(ctx, {
                interaction: {
                    name: "register",
                    action: {
                        submit: {
                            url: url(`/register`),
                            method: "POST",
                            data: {
                                email: "",
                                password: "",
                                confirmPassword: "",
                            },
                        },
                    },
                },
            });
        }));
        return router.routes();
    }
}
exports.InteractionFactory = InteractionFactory;
//# sourceMappingURL=interaction.js.map
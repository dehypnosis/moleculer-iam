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
    /*
    * can add more user interactive features (prompts) into base policy which includes login, consent prompts
    * example ref (base): https://github.com/panva/node-oidc-provider/tree/master/lib/helpers/interaction_policy/prompts
  
    * example route mappings (original default)
    get('interaction', '/interaction/:uid', error(this), ...interaction.render);
    post('submit', '/interaction/:uid', error(this), ...interaction.submit);
    get('abort', '/interaction/:uid/abort', error(this), ...interaction.abort);
  
    * each route handlers
    https://github.com/panva/node-oidc-provider/blob/8fb8af509c652b13620534cc755cf5b9320f694f/lib/actions/interaction.js
  
    * related views
    https://github.com/panva/node-oidc-provider/blob/master/lib/views/layout.js
    */
    interactions() {
        const { Prompt, Check, base } = provider_1.interactionPolicy;
        const defaultPrompts = base();
        return {
            url(ctx, interaction) {
                return tslib_1.__awaiter(this, void 0, void 0, function* () {
                    return `/interaction/${interaction.prompt.name}`;
                });
            },
            // ref: https://github.com/panva/node-oidc-provider/blob/cd9bbfb653ddfb99c574ea3d4519b6f834274e86/docs/README.md#user-flows
            // ... here goes more interactions
            policy: [
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
        const abort = {
            url: url(`/abort`),
            method: "POST",
            data: {},
        };
        // delegate error handling
        router.use((ctx, next) => {
            return next()
                .catch(error => render(ctx, { error }));
        });
        // abort interactions
        router.post("/abort", (ctx) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { prompt, params } = yield provider.interactionDetails(ctx.req, ctx.res);
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
            const { prompt, params } = yield provider.interactionDetails(ctx.req, ctx.res);
            ctx.assert(prompt.name === "login");
            return render(ctx, {
                interaction: {
                    name: "login",
                    action: {
                        submit: {
                            url: url(`/login`),
                            method: "POST",
                            data: {
                                email: params.login_hint || "",
                                password: "",
                            },
                        },
                        abort,
                    },
                },
            });
        }));
        router.post("/login", (ctx) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            // assert prompt name
            const { prompt, params } = yield provider.interactionDetails(ctx.req, ctx.res);
            ctx.assert(prompt.name === "login");
            const { email, password } = ctx.request.body;
            // 1. user enter email only
            if (typeof password === "undefined" || !password) {
                // 2. server validate email
                validate(ctx, { email: "email" });
                // 3. fetch identity
                const id = yield idp.findByEmail(email);
                const { preferred_username, nickname, name } = yield id.claims("id_token", "profile");
                return render(ctx, {
                    interaction: {
                        name: "login",
                        action: {
                            submit: {
                                url: url(`/login`),
                                method: "POST",
                                data: {
                                    email,
                                    password: "",
                                },
                            },
                            abort,
                        },
                        data: {
                            email,
                            name: preferred_username || nickname || name,
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
            const identity = yield idp.findByEmail(email);
            yield idp.assertCredentials(identity.accountId, { password });
            // 6. finish interaction and give redirection uri
            const redirect = yield provider.interactionResult(ctx.req, ctx.res, {
                // authentication/login prompt got resolved, omit if no authentication happened, i.e. the user
                // cancelled
                login: {
                    account: identity.accountId,
                    remember: true,
                },
            }, {
                mergeWithLastSubmission: true,
            });
            return render(ctx, { redirect });
        }));
        /* 2. CONSENT */
        router.get("/consent", (ctx) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { prompt, params, session } = yield provider.interactionDetails(ctx.req, ctx.res);
            // fetch identity and client
            const id = (yield idp.find(session.accountId));
            const client = (yield provider.Client.find(params.client_id));
            ctx.assert(prompt.name === "consent" && client && id);
            const { email, preferred_username, nickname, name } = yield id.claims("id_token", "profile email");
            return render(ctx, {
                interaction: {
                    name: "consent",
                    action: {
                        submit: {
                            url: url(`/consent`),
                            method: "POST",
                            data: {
                                rejectedScopes: [],
                                rejectedClaims: [],
                            },
                        },
                        abort,
                    },
                    data: Object.assign({ email, name: preferred_username || nickname || name, client: util_1.getPublicClientProps(client) }, prompt.details),
                },
            });
        }));
        router.post("/consent", (ctx) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { prompt, params } = yield provider.interactionDetails(ctx.req, ctx.res);
            ctx.assert(prompt.name === "consent");
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
        return router.routes();
    }
}
exports.InteractionFactory = InteractionFactory;
//# sourceMappingURL=interaction.js.map
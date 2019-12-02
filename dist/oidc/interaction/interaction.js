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
        this.validator = new fastest_validator_1.default();
        this.router = new koa_router_1.default({
            prefix: "/interaction",
            sensitive: true,
            strict: false,
        });
        // apply middleware
        this.router.use(koajs_nocache_1.default(), koa_bodyparser_1.default());
    }
    /*
    * add more user interactive features (prompts) into base policy which includes login, consent prompts
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
                    return `/interaction/${ctx.oidc.uid}`;
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
        /* helper methods */
        function url(path) {
            return `${provider.issuer}/interaction${path}`;
        }
        function getPublicClientPropsById(id) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                const client = id ? yield provider.Client.find(id) : undefined;
                if (!client) {
                    return undefined;
                }
                return util_1.getPublicClientProps(client);
            });
        }
        function getInteractionContext(ctx) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                const { uid, prompt, params, session } = yield provider.interactionDetails(ctx.req, ctx.res);
                return {
                    interaction_id: uid,
                    account_id: session && session.accountId || undefined,
                    client: yield getPublicClientPropsById(params.client_id),
                    prompt,
                    params,
                };
            });
        }
        const router = this.router;
        const { identity, renderer, logger } = this.props;
        /* abort any interactions */
        router.delete("/:id", (ctx) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield provider.interactionFinished(ctx.req, ctx.res, {
                error: "access_denied",
                error_description: "end-user aborted interaction",
            }, {
                mergeWithLastSubmission: false,
            });
        }));
        /* process each type of interactions */
        router.post("/:id", (ctx) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const context = yield getInteractionContext(ctx);
            const promptName = context.prompt.name;
            const body = ctx.request.body;
            /* validate params */
            let schema = null;
            switch (promptName) {
                case "login":
                    schema = {
                        username: "string|empty:false|trim:true",
                        password: "string|empty:false",
                    };
                    break;
                case "consent":
                    break;
                default:
            }
            if (schema) {
                const errors = this.validator.validate(body, schema);
                if (errors !== true && errors.length > 0) {
                    ctx.status = 422;
                    ctx.type = "json";
                    ctx.body = {
                        error: "validation_error",
                        error_description: errors,
                    };
                    return;
                }
            }
            /* update interactions */
            let redirect = null;
            switch (promptName) {
                case "login":
                    const { username, password } = body;
                    const account = username;
                    // TODO: resolve account
                    redirect = yield provider.interactionResult(ctx.req, ctx.res, {
                        // authentication/login prompt got resolved, omit if no authentication happened, i.e. the user
                        // cancelled
                        login: {
                            account,
                        },
                    }, {
                        mergeWithLastSubmission: true,
                    });
                    break;
                case "consent":
                    redirect = yield provider.interactionResult(ctx.req, ctx.res, {
                        consent: {},
                    }, {
                        mergeWithLastSubmission: true,
                    });
                    break;
                default:
                    ctx.throw("not implemented");
            }
            if (redirect) {
                ctx.type = "json";
                ctx.body = { redirect };
            }
        }));
        /* render application for any interactions */
        router.get("*", (ctx) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const context = yield getInteractionContext(ctx);
            // create form data format
            const submitFormData = {};
            switch (context.prompt.name) {
                case "login":
                    submitFormData.username = context.params.login_hint || "";
                    submitFormData.password = "";
                    break;
                case "consent":
                    break;
                default:
            }
            return renderer.render(ctx, {
                context,
                action: {
                    submit: {
                        url: url(`/${context.interaction_id}`),
                        method: "POST",
                        data: submitFormData,
                    },
                    abort: {
                        url: url(`/${context.interaction_id}`),
                        method: "DELETE",
                        data: {},
                    },
                },
            });
        }));
        return router.routes();
    }
}
exports.InteractionFactory = InteractionFactory;
//# sourceMappingURL=interaction.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const koa_router_1 = tslib_1.__importDefault(require("koa-router"));
const koa_bodyparser_1 = tslib_1.__importDefault(require("koa-bodyparser"));
const koajs_nocache_1 = tslib_1.__importDefault(require("koajs-nocache"));
const koa_compose_1 = tslib_1.__importDefault(require("koa-compose"));
const provider_1 = require("../provider");
const federation_1 = require("./federation");
const interaction_internal_1 = require("./interaction.internal");
const interaction_render_1 = require("./interaction.render");
// ref: https://github.com/panva/node-oidc-provider/blob/9306f66bdbcdff01400773f26539cf35951b9ce8/lib/models/client.js#L385
// @ts-ignore : need to hack oidc-provider private methods
const weak_cache_1 = tslib_1.__importDefault(require("oidc-provider/lib/helpers/weak_cache"));
// @ts-ignore : need to hack oidc-provider private methods
const session_1 = tslib_1.__importDefault(require("oidc-provider/lib/shared/session"));
const interaction_actions_1 = require("./interaction.actions");
const interaction_error_1 = require("./interaction.error");
const interaction_abort_1 = require("./interaction.abort");
const interaction_login_1 = require("./interaction.login");
const interaction_federation_1 = require("./interaction.federation");
const interaction_consent_1 = require("./interaction.consent");
const interaction_register_1 = require("./interaction.register");
const interaction_verify_email_1 = require("./interaction.verify_email");
const interaction_verify_phone_1 = require("./interaction.verify_phone");
const interaction_reset_password_1 = require("./interaction.reset_password");
const interaction_find_email_1 = require("./interaction.find_email");
class InteractionFactory {
    constructor(props, opts = {}) {
        this.props = props;
        this.opts = opts;
        // create renderer
        if (!opts.renderer) {
            opts.renderer = new (require("moleculer-iam-interaction-renderer").default)(); // to avoid circular deps in our monorepo workspace
        }
        this.renderer = new interaction_render_1.InteractionRenderer({
            ...props,
            adapter: opts.renderer,
        });
        // create internal interaction factory
        this.internal = new interaction_internal_1.InternalInteractionConfigurationFactory({ ...props, renderer: this.renderer });
    }
    configuration() {
        const { Prompt, Check, base } = provider_1.interactionPolicy;
        const defaultPrompts = base();
        return {
            interactions: {
                async url(ctx, interaction) {
                    return `/interaction/${interaction.prompt.name}`;
                },
                policy: [
                    // can modify policy and add prompt like: MFA, captcha, ...
                    defaultPrompts.get("login"),
                    defaultPrompts.get("consent"),
                ],
            },
            ...this.internal.configuration(),
        };
    }
    /* create interaction routes */
    routes(provider) {
        // create router
        const router = new koa_router_1.default({
            prefix: "/interaction",
            sensitive: true,
            strict: false,
        })
            .use(koajs_nocache_1.default(), koa_bodyparser_1.default(), function getContext() {
        });
        // prepare route props
        const { idp, logger } = this.props;
        const url = (path) => `${provider.issuer}/interaction${path}`;
        const federationCallbackURL = (providerName) => `${url("/federate")}/${providerName}`;
        const federation = new federation_1.IdentityFederationManager({
            logger,
            idp,
            callbackURL: federationCallbackURL,
        }, this.opts.federation);
        const actions = interaction_actions_1.getStaticInteractionActions({
            url,
            availableFederationProviders: federation.availableProviders,
        });
        const props = {
            devModeEnabled: this.props.devModeEnabled,
            logger,
            idp,
            provider,
            router,
            actions,
            url,
            federationCallbackURL,
            parseContext: async (ctx, next) => {
                // ensure oidc context is created
                if (!ctx.oidc) {
                    const OIDCContext = weak_cache_1.default(provider).OIDCContext;
                    Object.defineProperty(ctx, 'oidc', { value: new OIDCContext(ctx) });
                    await session_1.default(ctx, () => {
                        ctx.oidc.session.touched = true;
                    });
                    console.log("oidc.session.save", ctx.oidc.session);
                }
                // fetch interaction details
                const interaction = await provider.interactionDetails(ctx.req, ctx.res);
                // fetch identity and client
                const user = interaction.session && typeof interaction.session.accountId === "string" ? (await idp.findOrFail({ id: interaction.session.accountId })) : undefined;
                const client = interaction.params.client_id ? (await provider.Client.find(interaction.params.client_id)) : undefined;
                const locals = { interaction, user, client };
                ctx.locals = locals;
                return next();
            },
            render: this.renderer.render.bind(this.renderer),
            federation,
        };
        // apply middleware
        interaction_error_1.useErrorMiddleware(props);
        // map sub routes
        interaction_abort_1.useAbortInteraction(props);
        interaction_login_1.useLoginInteraction(props);
        interaction_find_email_1.useFindEmailInteraction(props);
        interaction_federation_1.useFederationInteraction(props);
        interaction_consent_1.useConsentInteraction(props);
        interaction_verify_phone_1.useVerifyPhoneInteraction(props);
        interaction_verify_email_1.useVerifyEmailInteraction(props);
        interaction_reset_password_1.useResetPasswordInteraction(props);
        interaction_register_1.useRegisterInteraction(props);
        // merge routes
        return koa_compose_1.default([
            router.routes(),
            ...this.renderer.routes(),
        ]);
    }
}
exports.InteractionFactory = InteractionFactory;
//# sourceMappingURL=interaction.js.map
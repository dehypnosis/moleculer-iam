"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
// ref: https://github.com/panva/node-oidc-provider/blob/9306f66bdbcdff01400773f26539cf35951b9ce8/lib/models/client.js#L385
// @ts-ignore : need to hack oidc-provider private methods
const weak_cache_1 = tslib_1.__importDefault(require("oidc-provider/lib/helpers/weak_cache"));
// @ts-ignore : need to hack oidc-provider private methods
const session_1 = tslib_1.__importDefault(require("oidc-provider/lib/shared/session"));
const JSON = "application/json";
const HTML = "text/html";
class OIDCProviderContextProxy {
    constructor(ctx, builder) {
        this.ctx = ctx;
        this.builder = builder;
        this.session = {};
        this.metadata = {};
    }
    get idp() {
        return this.builder.app.idp;
    }
    get provider() {
        return this.builder.app.op;
    }
    get getURL() {
        return this.builder.app.getURL;
    }
    get getNamedURL() {
        return this.provider.urlFor;
    }
    get routes() {
        return this.builder.app.getRoutes(this.interaction && this.interaction.prompt && this.interaction.prompt.name);
    }
    get sessionAppState() {
        return this.session.state && this.session.state[OIDCProviderContextProxy.sessionAppStateField] || {};
    }
    async setSessionState(update) {
        const { ctx, session } = this;
        const field = OIDCProviderContextProxy.sessionAppStateField;
        if (!session.state) {
            session.state = { custom: {} };
        }
        else if (!session.state[field]) {
            session.state[field] = {};
        }
        session.state[field] = update(session.state[field]);
        await session_1.default(ctx, () => {
            // @ts-ignore to set Set-Cookie response header
            session.touched = true;
        });
        // @ts-ignore store/update session in to adapter
        await session.save();
        return session.state[field];
    }
    get isXHR() {
        return this.ctx.accepts(JSON, HTML) === JSON;
    }
    async render(name, error, additionalRoutes) {
        const { ctx } = this;
        // response { error: {} } when is XHR and stateProps has error
        if (this.isXHR && error) {
            const response = { error };
            ctx.type = JSON;
            ctx.body = response;
            return;
        }
        // else response { state: {...} }
        const state = {
            name,
            error,
            routes: {
                ...this.routes,
                ...additionalRoutes,
            },
            metadata: this.metadata,
            locale: ctx.locale,
            session: this.sessionAppState,
            interaction: this.interaction,
            // current op interaction information (login, consent)
            client: this.clientMetadata,
            user: this.userClaims,
            device: this.device,
        };
        if (this.isXHR) {
            const response = { state };
            ctx.type = JSON;
            ctx.body = response;
            return;
        }
        // unwrap enhanced context to secure vulnerability, then delegate response to app renderer
        ctx.type = HTML;
        return this.builder.app.appRenderer.render(ctx.unwrap(), state);
    }
    async redirectWithUpdate(promptUpdate, allowedPromptNames) {
        const { ctx, interaction, provider } = this;
        ctx.assert(interaction && (!allowedPromptNames || allowedPromptNames.includes(interaction.prompt.name)));
        const mergedResult = { ...this.interaction.result, ...promptUpdate };
        const redirectURL = await provider.interactionResult(ctx.req, ctx.res, mergedResult, { mergeWithLastSubmission: true });
        // overwrite session account if need
        if (mergedResult.login) {
            await provider.setProviderSession(ctx.req, ctx.res, mergedResult.login);
            await this._parseInteractionState();
        }
        return this.redirect(redirectURL);
    }
    redirect(url) {
        const redirectURL = url.startsWith("/") ? this.getURL(url) : url; // add prefix for local redirection
        if (this.isXHR) {
            const response = { redirect: redirectURL };
            this.ctx.body = response;
            return;
        }
        this.ctx.redirect(redirectURL);
    }
    end() {
        const response = { session: this.sessionAppState };
        this.ctx.type = JSON;
        this.ctx.body = response;
    }
    assertPrompt(allowedPromptNames) {
        const { ctx, interaction } = this;
        ctx.assert(interaction && (!allowedPromptNames || allowedPromptNames.includes(interaction.prompt.name)));
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
    async _dangerouslyCreate() {
        const { ctx, idp, provider } = this;
        const hiddenProvider = weak_cache_1.default(provider);
        // @ts-ignore ensure oidc context is created
        if (!ctx.oidc) {
            Object.defineProperty(ctx, "oidc", { value: new hiddenProvider.OIDCContext(ctx) });
        }
        const configuration = hiddenProvider.configuration();
        this.session = await provider.Session.get(ctx);
        this.metadata = {
            federationProviders: this.builder.app.federation.providerNames,
            mandatoryScopes: idp.claims.mandatoryScopes,
            supportedScopes: idp.claims.supportedScopes,
            discovery: configuration.discovery,
        };
        await this._parseInteractionState();
        return this;
    }
    async _parseInteractionState() {
        const { ctx, idp, provider } = this;
        // get current prompt information
        try {
            const interaction = await provider.interactionDetails(ctx.req, ctx.res);
            this.interaction = interaction;
            this.user = interaction.session && typeof interaction.session.accountId === "string" ? (await idp.findOrFail({ id: interaction.session.accountId })) : undefined;
            if (this.user) {
                this.userClaims = await this.getPublicUserProps(this.user);
            }
            this.client = interaction.params.client_id ? await provider.Client.find(interaction.params.client_id) : undefined;
            if (this.client) {
                this.clientMetadata = await this.getPublicClientProps(this.client);
            }
        }
        catch (err) { }
    }
}
exports.OIDCProviderContextProxy = OIDCProviderContextProxy;
OIDCProviderContextProxy.sessionAppStateField = "__app__";
//# sourceMappingURL=context.js.map
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
        return this.builder.interaction.idp;
    }
    get provider() {
        return this.builder.interaction.op;
    }
    get getURL() {
        return this.builder.interaction.getURL;
    }
    get getNamedURL() {
        return this.provider.urlFor;
    }
    async render(stateProps) {
        const { ctx } = this;
        const state = {
            name: "undefined",
            actions: {},
            ...stateProps,
            metadata: this.metadata,
            session: this.session.state && this.session.state.custom || {},
        };
        if (ctx.accepts(JSON, HTML) === JSON) {
            ctx.type = JSON;
            const response = { state };
            ctx.body = response;
            return;
        }
        ctx.type = HTML;
        return this.builder.interaction.stateRenderer.render(ctx, state);
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
        return ctx.redirect(redirectURL);
    }
    redirect(url) {
        return this.ctx.redirect(url.startsWith("/") ? this.getURL(url) : url);
    }
    ;
    end() {
        const { ctx, session } = this;
        const response = { session: session.state && session.state.custom || {} };
        ctx.type = JSON;
        ctx.body = response;
    }
    assertPrompt(allowedPromptNames) {
        const { ctx, interaction } = this;
        ctx.assert(interaction && (!allowedPromptNames || allowedPromptNames.includes(interaction.prompt.name)));
    }
    async setSessionState(update) {
        const { ctx, session } = this;
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
        // @ts-ignore store/update session in to adapter
        await session.save();
        return session.state.custom;
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
            availableFederationProviders: this.builder.interaction.federation.providerNames,
            // availableScopes: await this.idp.claims.getActiveClaimsSchemata()
            //   .then(schemata =>
            //     schemata.reduce((scopes, schema) => {
            //       scopes[schema.scope] = scopes[schema.scope] || {};
            //       scopes[schema.scope][schema.key] = schema.validation;
            //       return scopes;
            //     }, {} as any)
            //   ),
            mandatoryScopes: idp.claims.mandatoryScopes,
            locale: ctx.locale,
            discovery: configuration.discovery,
            xsrf: this.session.state && this.session.state.secret || undefined,
        };
        await this._parseInteractionState();
        return this;
    }
    async _parseInteractionState() {
        const { ctx, idp, provider } = this;
        try {
            const interaction = await provider.interactionDetails(ctx.req, ctx.res);
            this.interaction = interaction;
            this.user = interaction.session && typeof interaction.session.accountId === "string" ? (await idp.findOrFail({ id: interaction.session.accountId })) : undefined;
            if (this.user) {
                this.metadata.user = await this.getPublicUserProps(this.user);
            }
            this.client = interaction.params.client_id ? await provider.Client.find(interaction.params.client_id) : undefined;
            if (this.client) {
                this.metadata.client = await this.getPublicClientProps(this.client);
            }
        }
        catch (err) { }
    }
}
exports.OIDCProviderContextProxy = OIDCProviderContextProxy;
//# sourceMappingURL=context.js.map
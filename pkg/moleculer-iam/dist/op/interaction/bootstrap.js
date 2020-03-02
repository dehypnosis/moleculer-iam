"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const oidc_provider_1 = require("oidc-provider");
const renderer_1 = require("./renderer");
function buildDefaultInteractions(builder, opts = {}) {
    const { prefix = "/op", federation, renderer } = opts;
    builder
        // set routes url prefix
        .setPrefix(prefix)
        // set supported interactions, custom prompts like: MFA, captcha, rate limit, ... can be added
        .setInteractionPolicy([
        oidc_provider_1.interactionPolicy.base().get("login"),
        oidc_provider_1.interactionPolicy.base().get("consent"),
    ])
        // set default bridge for IDP and OP session and tokens (default)
        .setFindAccount((ctx, id, token) => {
        return builder.interaction.idp.findOrFail({ id })
            .catch(async (err) => {
            await ctx.oidc.session.destroy();
            throw err;
        });
    })
        // extend client metadata
        .setExtraClientMetadata({
        // skip consent phase for skip_consent feature enabled client
        properties: ["skip_consent"],
        validator(k, v, meta) {
            switch (k) {
                case "skip_consent":
                    if (typeof v !== "boolean") {
                        // throw new errors.InvalidClientMetadata("skip_consent should be boolean type value");
                        meta.skip_consent = false;
                    }
                    break;
                default:
                    throw new oidc_provider_1.errors.InvalidClientMetadata("unknown client property: " + k);
            }
        },
    })
        // support extra params for /auth?change_account=true&blabla to not auto-fill signed in session account
        .setExtraParams(["change_account"]);
    // set interaction renderer
    const { render, routes } = new renderer_1.InteractionRendererFactory({
        logger: builder.logger,
        dev: builder.dev,
        prefix,
        metadata: builder.staticConfig.discovery,
    }, renderer)
        .create();
    builder.interaction.setRenderFunction(render);
    builder.interaction.use(...routes);
    // TODO: build interaction routes
    builder.interaction.router
        .get("/test", ctx => {
        return ctx.op.render({
            interaction: {
                name: "test",
                data: {
                    locale: ctx.locale,
                },
            },
        });
    })
        .get("/login", async (ctx) => {
        await ctx.op.setSessionState({ test: new Date().toISOString() });
        ctx.body = ctx.op.session;
    });
}
exports.buildDefaultInteractions = buildDefaultInteractions;
//# sourceMappingURL=bootstrap.js.map
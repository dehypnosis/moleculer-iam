"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class InteractionRendererFactory {
    constructor(props, renderer) {
        this.props = props;
        this.renderer = renderer || new (require("moleculer-iam-interaction-renderer").default)();
    }
    create() {
        const { renderer, props } = this;
        return {
            routes: renderer.routes(props),
            render: async (ctx, state) => {
                const { JSON, HTML } = InteractionRendererFactory.contentTypes;
                // response for ajax
                if (ctx.accepts(JSON, HTML) === JSON) {
                    ctx.type = JSON;
                    ctx.body = state.error || state; // response error only for xhr request
                    return;
                }
                // response redirection
                if (state.redirect) {
                    ctx.status = 302;
                    ctx.redirect(state.redirect);
                    return;
                }
                // response HTML
                ctx.type = HTML;
                return renderer.render(ctx, state, props);
            },
        };
    }
}
exports.InteractionRendererFactory = InteractionRendererFactory;
InteractionRendererFactory.contentTypes = {
    JSON: "application/json",
    HTML: "text/html",
};
//# sourceMappingURL=renderer.js.map
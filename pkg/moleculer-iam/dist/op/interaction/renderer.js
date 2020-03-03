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
            render: async (ctx, res) => {
                const { JSON, HTML } = InteractionRendererFactory.contentTypes;
                // response for ajax
                if (ctx.accepts(JSON, HTML) === JSON) {
                    ctx.type = JSON;
                    ctx.body = res;
                    return;
                }
                // response HTML
                ctx.type = HTML;
                return renderer.render(ctx, res, props);
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
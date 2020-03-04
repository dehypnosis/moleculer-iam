"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dummyInteractionPageRendererFactory = ({ logger }) => {
    logger.error(`set dummy page renderer`);
    return {
        routes() {
            return [];
        },
        async render(ctx, response) {
            ctx.body = `<html><body style="margin: 0; background: red; min-height: 100vh; padding: 5em; color: white; font-size: 1.5em; font-family: Verdana"><div><p style="font-weight: bold">Warning: Interaction page renderer not configured.</p><pre>${JSON.stringify(response, null, 2)}</pre></div></body></html>`;
        },
    };
};
//# sourceMappingURL=renderer.js.map
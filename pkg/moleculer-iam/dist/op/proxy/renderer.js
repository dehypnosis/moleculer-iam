"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dummyAppStateRendererFactory = ({ logger }) => {
    logger.error(`set dummy application renderer`);
    return {
        routes() {
            return [];
        },
        async render(ctx, state) {
            ctx.body = `<html><body style="margin: 0; background: red; min-height: 100vh; padding: 5em; color: white; font-size: 1.5em; font-family: Verdana"><div><p style="font-weight: bold">Warning: Interaction page renderer not configured.</p><pre>${JSON.stringify(state, null, 2)}</pre></div></body></html>`;
        },
    };
};
//# sourceMappingURL=renderer.js.map
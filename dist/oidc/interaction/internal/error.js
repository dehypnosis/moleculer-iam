"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const render_1 = require("./render");
// render interaction errors
exports.renderError = (ctx, out, error) => {
    // @ts-ignore
    ctx.status = error.status || error.statusCode || 500;
    // @ts-ignore
    if (!error.expose) {
        (ctx.logger || console).error(error);
    }
    render_1.renderInternalFlow(ctx, {
        error: {
            name: out.error,
            description: out.error_description || null,
        },
    });
};
//# sourceMappingURL=error.js.map
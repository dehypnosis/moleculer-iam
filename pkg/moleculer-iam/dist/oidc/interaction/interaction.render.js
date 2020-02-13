"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultInteractionRenderer = (ctx, props) => {
    ctx.type = "json";
    if (props && props.error) {
        ctx.status = props.error.status || props.error.statusCode || 500;
        ctx.body = props.error;
    }
    else {
        ctx.status = 200;
        ctx.body = props && props.interaction || null;
    }
};
//# sourceMappingURL=interaction.render.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const _ = tslib_1.__importStar(require("lodash"));
const defaultProps = {
    action: {},
    data: {},
    error: null,
};
exports.render = (ctx, props = {}) => {
    ctx.type = "json";
    const { context = {}, action = null, error = null } = props;
    ctx.body = _.defaultsDeep({
        context,
        action,
        error,
    }, defaultProps);
};
//# sourceMappingURL=render.js.map
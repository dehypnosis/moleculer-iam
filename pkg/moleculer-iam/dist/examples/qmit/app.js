"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const koa_router_1 = tslib_1.__importDefault(require("koa-router"));
exports.app = async (oidc) => {
    const router = new koa_router_1.default({
        sensitive: false,
        strict: false,
    });
    // ... nothing
    return router.routes();
};
//# sourceMappingURL=app.js.map
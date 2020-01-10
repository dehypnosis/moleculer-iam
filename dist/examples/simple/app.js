"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const koa_router_1 = tslib_1.__importDefault(require("koa-router"));
exports.app = (oidc) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const router = new koa_router_1.default({
        sensitive: false,
        strict: false,
    });
    router.get("/", (ctx, next) => {
        ctx.body = `<html><body>Any optional application routes can be mapped except reserved ones:<pre>${JSON.stringify(oidc.defaultRoutes, null, 2)}</pre></body></html>`;
    });
    return router.routes();
});
//# sourceMappingURL=app.js.map
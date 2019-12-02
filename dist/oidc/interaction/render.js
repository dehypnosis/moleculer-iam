"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const koa_router_1 = tslib_1.__importDefault(require("koa-router"));
const koa_static_1 = tslib_1.__importDefault(require("koa-static"));
const path_1 = tslib_1.__importDefault(require("path"));
class ClientApplicationRenderer {
    constructor(props, opts) {
        this.props = props;
        this.renderHTML = opts && opts.renderHTML || ClientApplicationRenderer.defaultRenderHTML;
    }
    assetsRoutes() {
        // serve assets if default renderHTML used
        if (this.renderHTML === ClientApplicationRenderer.defaultRenderHTML) {
            return new koa_router_1.default({
                prefix: "/assets",
                strict: false,
            })
                .use(koa_static_1.default(path_1.default.join(__dirname, "../../../dist/assets")))
                .routes();
        }
    }
    render(ctx, props = {}) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { context, action = null, data = {}, error = null } = props;
            ctx.type = "html";
            ctx.body = yield this.renderHTML({
                context,
                action,
                data,
                error,
            });
        });
    }
}
exports.ClientApplicationRenderer = ClientApplicationRenderer;
// default renderHTML option
ClientApplicationRenderer.defaultRenderHTML = props => {
    return `
<html>
<body>
<h1>Render SPA here with below props!</h1>
<pre>${JSON.stringify(props, null, 2)}</pre>
<script>window.OIDC=${JSON.stringify(props)};</script>
</body>
</html>`;
};
//# sourceMappingURL=render.js.map
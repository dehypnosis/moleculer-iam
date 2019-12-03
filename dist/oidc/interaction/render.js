"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path_1 = tslib_1.__importDefault(require("path"));
const fs_1 = tslib_1.__importDefault(require("fs"));
const kleur_1 = tslib_1.__importDefault(require("kleur"));
const _ = tslib_1.__importStar(require("lodash"));
const koa_static_cache_1 = tslib_1.__importDefault(require("koa-static-cache"));
const defaultAssetsPath = path_1.default.join(__dirname, "../../../dist/assets");
let defaultApp;
const defaultRenderHTML = props => {
    if (!defaultApp) {
        const html = fs_1.default.readFileSync(path_1.default.join(defaultAssetsPath, "index.html")).toString();
        const index = html.indexOf("<script");
        defaultApp = {
            html,
            header: html.substring(0, index),
            footer: html.substring(index),
        };
    }
    return props
        ? defaultApp.header + `<script>window.OIDC=${JSON.stringify(props)};</script>` + defaultApp.footer
        : defaultApp.html;
};
class ClientApplicationRenderer {
    constructor(props, opts) {
        this.props = props;
        const { renderHTML, assetsRoutePrefix, assetsDirAbsolutePath, assetsCacheMaxAge } = _.defaultsDeep(opts || {}, {
            renderHTML: defaultRenderHTML,
            assetsRoutePrefix: "/assets",
            assetsDirAbsolutePath: defaultAssetsPath,
            assetsCacheMaxAge: 60 * 60 * 24 * 14,
        });
        this.renderHTML = renderHTML;
        this.isValidPath = opts && opts.isValidPath || ((p) => true);
        if (assetsRoutePrefix && assetsDirAbsolutePath) {
            props.logger.info(`${kleur_1.default.green(assetsDirAbsolutePath)} files are being served in ${kleur_1.default.blue(assetsRoutePrefix)} for client application assets`);
            this.routes = koa_static_cache_1.default(assetsDirAbsolutePath, {
                maxAge: assetsCacheMaxAge,
                prefix: assetsRoutePrefix,
                dynamic: true,
                preload: false,
            });
        }
    }
    render(ctx, props) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            ctx.type = "html";
            // matched SPA route... response with OK code
            if (ctx.status === 404 && (yield this.isValidPath(ctx.path)) || !props) {
                ctx.status = 200;
                ctx.body = yield this.renderHTML();
            }
            else {
                const { context, action = null, data = {}, error = null } = props;
                ctx.body = yield this.renderHTML({
                    context,
                    action,
                    data,
                    error,
                });
            }
        });
    }
}
exports.ClientApplicationRenderer = ClientApplicationRenderer;
//# sourceMappingURL=render.js.map
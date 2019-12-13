"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path_1 = tslib_1.__importDefault(require("path"));
const fs_1 = tslib_1.__importDefault(require("fs"));
const kleur_1 = tslib_1.__importDefault(require("kleur"));
const _ = tslib_1.__importStar(require("lodash"));
const koa_compose_1 = tslib_1.__importDefault(require("koa-compose"));
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
const contentTypes = {
    JSON: "application/json",
    HTML: "text/html",
};
class ClientApplicationRenderer {
    constructor(props, opts) {
        this.props = props;
        const { renderHTML, assetsRoutePrefix, assetsDirAbsolutePath, assetsCacheMaxAge, client } = _.defaultsDeep(opts || {}, {
            renderHTML: defaultRenderHTML,
            assetsRoutePrefix: "/assets",
            assetsDirAbsolutePath: defaultAssetsPath,
            assetsCacheMaxAge: 60 * 60 * 24 * 14,
        });
        this.renderHTML = renderHTML;
        this.isValidPath = opts && opts.isValidPath || ((p) => true);
        // prepare router
        const fns = [];
        // serve static assets
        if (assetsRoutePrefix && assetsDirAbsolutePath) {
            props.logger.info(`${kleur_1.default.green(assetsDirAbsolutePath)} files are being served in ${kleur_1.default.blue(assetsRoutePrefix)} for client application assets`);
            fns.push(koa_static_cache_1.default(assetsDirAbsolutePath, {
                maxAge: assetsCacheMaxAge,
                prefix: assetsRoutePrefix,
                dynamic: true,
                preload: false,
            }));
        }
        if (fns.length > 0) {
            this.router = koa_compose_1.default(fns);
        }
    }
    static normalizeError(error) {
        return {
            name: error.name,
            message: error.error_description || error.message,
            detail: error.error_detail || error.detail,
            status: error.status || error.statusCode || 500,
        };
    }
    render(ctx, props) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            // normalize error if have
            if (props && props.error) {
                props.error = ClientApplicationRenderer.normalizeError(props.error);
            }
            const error = props && props.error;
            // response for ajax
            if (ctx.accepts(contentTypes.JSON, contentTypes.HTML) === contentTypes.JSON) {
                ctx.type = contentTypes.JSON;
                ctx.status = error ? error.status : 200;
                return ctx.body = props || {};
            }
            // response redirection
            if (props && props.redirect) {
                ctx.status = 302;
                return ctx.redirect(props.redirect);
            }
            // response HTML (app)
            // set 404 status as 200 for matched SPA path
            if (props && props.error && props.error.status === 404 && (yield this.isValidPath(ctx.path))) {
                ctx.status = 200;
                props = undefined;
            }
            ctx.type = contentTypes.HTML;
            ctx.status = error ? error.status : 200;
            return ctx.body = yield this.renderHTML(props);
        });
    }
}
exports.ClientApplicationRenderer = ClientApplicationRenderer;
//# sourceMappingURL=app.js.map
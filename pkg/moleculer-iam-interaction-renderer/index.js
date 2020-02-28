"use strict";
/*
  should be recompiled (yarn workspace moleculer-iam-interaction-renderer build-server) on updates
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var koa_static_cache_1 = __importDefault(require("koa-static-cache"));
var config_1 = __importDefault(require("./config"));
var output = config_1.default.output;
var DefaultInteractionRendererAdapter = /** @class */ (function () {
    function DefaultInteractionRendererAdapter(options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        this.options = options;
        this.render = function (state, dev) {
            // reload views for each rendering for development mode
            if (dev) {
                try {
                    _this.loadViews();
                }
                catch (error) {
                    console.error("failed to reload views", error);
                }
            }
            // merge partial options to state, ref ./src/server-state.ts
            state.options = _this.options;
            // serialize state
            var serializedState;
            try {
                serializedState = JSON.stringify(state);
            }
            catch (error) {
                console.error("failed to stringify server state", state, error);
                serializedState = JSON.stringify({ error: { error: error.name, error_description: error.message } });
            }
            var _a = _this.views, header = _a.header, footer = _a.footer, html = _a.html;
            return serializedState
                ? header + ("<script>window.__SERVER_STATE__=" + serializedState + ";</script>") + footer
                : html;
        };
        this.routes = function (dev) {
            return [
                koa_static_cache_1.default(output.path, {
                    maxAge: dev ? 0 : 60 * 60 * 24 * 7,
                    prefix: output.publicPath,
                    dynamic: dev,
                    preload: !dev,
                }),
            ];
        };
        this.loadViews();
    }
    DefaultInteractionRendererAdapter.prototype.loadViews = function () {
        var html = fs_1.default.readFileSync(path_1.default.join(output.path, "index.html")).toString();
        var index = html.indexOf("<script");
        this.views = {
            html: html,
            header: html.substring(0, index),
            footer: html.substring(index),
        };
    };
    return DefaultInteractionRendererAdapter;
}());
exports.default = DefaultInteractionRendererAdapter;

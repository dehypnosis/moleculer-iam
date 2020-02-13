"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const http = tslib_1.__importStar(require("http"));
const http2 = tslib_1.__importStar(require("http2"));
const https = tslib_1.__importStar(require("https"));
const kleur = tslib_1.__importStar(require("kleur"));
const koa_1 = tslib_1.__importDefault(require("koa"));
const koa_helmet_1 = tslib_1.__importDefault(require("koa-helmet"));
const koa_json_1 = tslib_1.__importDefault(require("koa-json"));
const logging_1 = require("./logging");
const koa_compose_1 = tslib_1.__importDefault(require("koa-compose"));
/*
  Mount OIDC Provider routes and static client application
 */
class IAMServer {
    constructor(props, opts) {
        this.props = props;
        this.working = false;
        const options = this.options = opts || {};
        this.logger = props.logger || console;
        // create web server application
        const app = this.app = new koa_1.default();
        app.env = "production";
        app.proxy = true;
        // apply web security and logging middleware
        app.use(logging_1.logging(this.logger, options.logging));
        app.use(koa_helmet_1.default(options.security));
        app.use(koa_json_1.default({
            pretty: true,
            spaces: 2,
        }));
        // mount optional app and oidc provider router
        if (options.app) {
            options.app(props.oidc)
                .then(appRoutes => {
                app.use(koa_compose_1.default([appRoutes, props.oidc.routes]));
            }, err => {
                this.logger.error("failed to initialize server application:", err);
                app.use(props.oidc.routes);
            });
        }
        else {
            app.use(props.oidc.routes);
        }
    }
    start() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this.working) {
                return;
            }
            // start op
            yield this.props.oidc.start();
            // start servers
            const config = this.options;
            const handler = this.app.callback();
            if (config.http2s) {
                const _a = config.http2s, { hostname, port = 443 } = _a, opts = tslib_1.__rest(_a, ["hostname", "port"]);
                this.http2s = http2.createSecureServer(opts, handler);
                this.http2s.listen(port, hostname, undefined, this.listenCallback("http2", "https", hostname, port));
            }
            if (config.http2) {
                const _b = config.http2, { hostname, port = 8080 } = _b, opts = tslib_1.__rest(_b, ["hostname", "port"]);
                this.http2 = http2.createServer(opts, handler);
                this.http2.listen(port, hostname, undefined, this.listenCallback("http2", "http", hostname, port));
            }
            if (config.https) {
                const _c = config.https, { hostname, port = 443 } = _c, opts = tslib_1.__rest(_c, ["hostname", "port"]);
                this.https = https.createServer(opts, handler);
                this.https.listen(port, hostname, undefined, this.listenCallback("https", "https", hostname, port));
            }
            if (config.http || !this.https && !this.http2 && !this.http2s) {
                const _d = config.http || { hostname: "localhost" }, { hostname, port = 8080 } = _d, opts = tslib_1.__rest(_d, ["hostname", "port"]);
                this.http = http.createServer(opts, handler);
                this.http.listen(port, hostname, undefined, this.listenCallback("http", "http", hostname, port));
            }
            this.working = true;
            this.logger.info(`IAM server has been started`);
        });
    }
    listenCallback(protocol, scheme, hostname, port) {
        const oidc = this.props.oidc;
        const discoveryURL = kleur.blue(`${scheme}://${hostname}:${port}${oidc.discoveryPath}`);
        const issuerURL = kleur.yellow(oidc.issuer);
        return () => {
            this.logger.info(`${kleur.blue(protocol.toUpperCase() + " server")} is listening:\n* OIDC discovery endpoint: ${discoveryURL}\n* OIDC issuer: ${issuerURL}`);
        };
    }
    stop() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!this.working) {
                return;
            }
            if (this.http) {
                this.http.close(() => this.logger.info(`http server has been stopped`));
            }
            if (this.https) {
                this.https.close(() => this.logger.info(`https server has been stopped`));
            }
            if (this.http2) {
                this.http2.close(() => this.logger.info(`http2 server has been stopped`));
            }
            if (this.http2s) {
                this.http2s.close(() => this.logger.info(`http2s server has been stopped`));
            }
            // stop op
            yield this.props.oidc.stop();
            this.working = false;
            this.logger.info(`IAM server has been stopped`);
        });
    }
}
exports.IAMServer = IAMServer;
//# sourceMappingURL=server.js.map
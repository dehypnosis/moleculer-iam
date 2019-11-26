"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const kleur = tslib_1.__importStar(require("kleur"));
const http = tslib_1.__importStar(require("http"));
const http2 = tslib_1.__importStar(require("http2"));
const https = tslib_1.__importStar(require("https"));
const base_1 = require("./base");
const methods_1 = require("./methods");
class OIDCProvider {
    constructor(props, options) {
        this.props = props;
        const { server } = props, baseProps = tslib_1.__rest(props, ["server"]);
        const baseOpts = tslib_1.__rest(options, []);
        const logger = this.logger = props.logger || console;
        /* create OIDCProviderBase */
        const base = this.base = new base_1.OIDCProviderBase(baseProps, baseOpts);
        /* create methods */
        this.client = methods_1.createClientMethods(base);
    }
    start() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            // start OIDC provider base
            yield this.base.start();
            // start servers
            const config = this.props.server || {};
            const handler = this.base.httpRequestHandler;
            if (config.http2s) {
                const _a = config.http2s, { hostname, port = 443 } = _a, opts = tslib_1.__rest(_a, ["hostname", "port"]);
                this.http2s = http2.createSecureServer(opts, handler);
                this.http2s.listen(port, hostname, undefined, () => {
                    this.logger.info(`OIDC provider http2s server listening to ${kleur.blue(`https://${hostname}:${port}`)}`);
                });
            }
            if (config.http2) {
                const _b = config.http2, { hostname, port = 8080 } = _b, opts = tslib_1.__rest(_b, ["hostname", "port"]);
                this.http2 = http2.createServer(opts, handler);
                this.http2.listen(port, hostname, undefined, () => {
                    this.logger.info(`OIDC provider http2 server listening to ${kleur.blue(`http://${hostname}:${port}`)}`);
                });
            }
            if (config.https) {
                const _c = config.https, { hostname, port = 443 } = _c, opts = tslib_1.__rest(_c, ["hostname", "port"]);
                this.https = https.createServer(opts, handler);
                this.https.listen(port, hostname, undefined, () => {
                    this.logger.info(`OIDC provider https server listening to ${kleur.blue(`https://${hostname}:${port}`)}`);
                });
            }
            if (config.http || !this.https && !this.http2 && !this.http2s) {
                const _d = config.http || { hostname: "0.0.0.0" }, { hostname, port = 8080 } = _d, opts = tslib_1.__rest(_d, ["hostname", "port"]);
                this.http = http.createServer(opts, handler);
                this.http.listen(port, hostname, undefined, () => {
                    this.logger.info(`OIDC provider http server listening to ${kleur.blue(`http://${hostname}:${port}`)}`);
                });
            }
            this.logger.info(`OIDC provider has been started`);
        });
    }
    stop() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this.http) {
                this.http.close(() => this.logger.info(`OIDC provider http server has been stopped`));
            }
            if (this.https) {
                this.https.close(() => this.logger.info(`OIDC provider https server has been stopped`));
            }
            if (this.http2) {
                this.http2.close(() => this.logger.info(`OIDC provider http2 server has been stopped`));
            }
            if (this.http2s) {
                this.http2s.close(() => this.logger.info(`OIDC provider http2s server has been stopped`));
            }
            // stop OIDC provider base
            yield this.base.stop();
            this.logger.info(`OIDC provider has been stopped`);
        });
    }
}
exports.OIDCProvider = OIDCProvider;
//# sourceMappingURL=oidc.js.map
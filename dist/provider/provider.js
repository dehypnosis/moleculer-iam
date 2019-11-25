"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const _ = tslib_1.__importStar(require("lodash"));
const kleur = tslib_1.__importStar(require("kleur"));
const http = tslib_1.__importStar(require("http"));
const http2 = tslib_1.__importStar(require("http2"));
const https = tslib_1.__importStar(require("https"));
const oidc_provider_1 = require("oidc-provider");
require("./typings"); // extend oidc-provider types
const options_1 = require("./options");
const extensions_1 = require("./extensions");
var oidc_provider_2 = require("oidc-provider");
exports.OIDCErrors = oidc_provider_2.errors;
// need to hack oidc-provider private methods
// @ts-ignore
const weak_cache_1 = tslib_1.__importDefault(require("oidc-provider/lib/helpers/weak_cache"));
/*
 * Checkout document for configurations: https://github.com/panva/node-oidc-provider/tree/master/docs
 * Library default values: https://github.com/panva/node-oidc-provider/blob/master/lib/helpers/defaults.js
 */
class OIDCProvider {
    constructor(props, opts) {
        this.props = props;
        this.working = false;
        const { issuer, logger, trustProxy } = props;
        // set logger
        this.logger = logger || console;
        // create OIDC provider
        const options = _.defaultsDeep(opts || {}, OIDCProvider.defaultOptions);
        const provider = this.provider = new oidc_provider_1.Provider(issuer, options);
        provider.proxy = trustProxy !== false;
        // apply debug options
        if (issuer.startsWith("http://")) {
            extensions_1.extendOIDCProvider(provider, this.logger, {
                "disable-implicit-forbid-localhost": true,
                "disable-implicit-force-https": true,
            });
        }
        // get hidden property map of provider instance
        this.providerProps = weak_cache_1.default(provider);
    }
    start() {
        if (this.working)
            return;
        this.working = true;
        if (this.props.http2s) {
            const _a = this.props.http2s, { hostname, port = 443 } = _a, opts = tslib_1.__rest(_a, ["hostname", "port"]);
            this.http2s = http2.createSecureServer(opts, this.provider.callback);
            this.http2s.listen(port, hostname, undefined, () => {
                this.logger.info(`OIDC provider http2s server listening to ${kleur.blue(`https://${hostname}:${port}`)}`);
            });
        }
        if (this.props.http2) {
            const _b = this.props.http2, { hostname, port = 8080 } = _b, opts = tslib_1.__rest(_b, ["hostname", "port"]);
            this.http2 = http2.createServer(opts, this.provider.callback);
            this.http2.listen(port, hostname, undefined, () => {
                this.logger.info(`OIDC provider http2 server listening to ${kleur.blue(`http://${hostname}:${port}`)}`);
            });
        }
        if (this.props.https) {
            const _c = this.props.https, { hostname, port = 443 } = _c, opts = tslib_1.__rest(_c, ["hostname", "port"]);
            this.https = https.createServer(opts, this.provider.callback);
            this.https.listen(port, hostname, undefined, () => {
                this.logger.info(`OIDC provider https server listening to ${kleur.blue(`https://${hostname}:${port}`)}`);
            });
        }
        if (this.props.http || !this.https && !this.http2 && !this.http2s) {
            const _d = this.props.http || { hostname: "0.0.0.0" }, { hostname, port = 8080 } = _d, opts = tslib_1.__rest(_d, ["hostname", "port"]);
            this.http = http.createServer(opts, this.provider.callback);
            this.http.listen(port, hostname, undefined, () => {
                this.logger.info(`OIDC provider http server listening to ${kleur.blue(`http://${hostname}:${port}`)}`);
            });
        }
        this.logger.info(`OIDC provider has been started`);
    }
    stop() {
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
        this.logger.info(`OIDC provider has been stopped`);
        this.working = false;
    }
    /* client management */
    findClient(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const client = yield this.providerProps.Client.find(id);
            return client || null;
        });
    }
    createClient(metadata) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.logger.info(`create client ${kleur.cyan(metadata.client_id)}:`, metadata);
            if (metadata.client_id && (yield this.findClient(metadata.client_id))) {
                throw new Error("client_id_duplicated");
            }
            return yield this.providerProps.clientAdd(metadata, { store: true });
        });
    }
    updateClient(metadata) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.logger.info(`update client ${kleur.cyan(metadata.client_id || "<unknown>")}:`, metadata);
            if (!metadata.client_id || !(yield this.findClient(metadata.client_id))) {
                throw new Error("client_not_found");
            }
            return yield this.providerProps.clientAdd(metadata, { store: true });
        });
    }
    removeClient(id) {
        this.logger.info(`remove client ${kleur.cyan(id)}`);
        return this.providerProps.clientRemove(id);
    }
}
exports.OIDCProvider = OIDCProvider;
OIDCProvider.defaultOptions = options_1.defaultOIDCProviderOptions;
//# sourceMappingURL=provider.js.map
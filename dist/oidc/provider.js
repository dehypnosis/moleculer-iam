"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const _ = tslib_1.__importStar(require("lodash"));
const kleur = tslib_1.__importStar(require("kleur"));
const http = tslib_1.__importStar(require("http"));
const http2 = tslib_1.__importStar(require("http2"));
const https = tslib_1.__importStar(require("https"));
// @ts-ignore
const weak_cache_1 = tslib_1.__importDefault(require("oidc-provider/lib/helpers/weak_cache"));
const oidc_provider_1 = require("oidc-provider");
class OIDCProvider {
    constructor(props, opts) {
        this.props = props;
        const { issuer, logger, trustProxy } = props;
        // set logger
        this.logger = logger || console;
        // create OIDC provider
        const options = _.defaultsDeep(opts || {}, OIDCProvider.defaultOptions);
        const provider = this.provider = new oidc_provider_1.Provider(issuer, options);
        provider.proxy = trustProxy !== false;
        // apply debug options
        if (issuer.startsWith("http://")) {
            const warn = this.logger.warn;
            // @ts-ignore
            const invalidate = provider.Client.Schema.prototype.invalidate;
            // @ts-ignore
            provider.Client.Schema.prototype.invalidate = function (message, code) {
                if (code === "implicit-force-https" || code === "implicit-forbid-localhost") {
                    warn(`${kleur.red(code)} error ${kleur.yellow("ignored")} for debugging purpose in client schema validation: ${kleur.cyan(this.client_id)}`);
                    return;
                }
                invalidate.call(this, message);
            };
        }
        // get hidden property map of provider instance
        this.providerProps = weak_cache_1.default(provider);
    }
    start() {
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
    }
    findClient(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const client = yield this.providerProps.Client.find(id);
            return client || null;
        });
    }
    upsertClient(metadata) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return (yield this.providerProps.clientAdd(metadata, { store: true })) || null;
        });
    }
}
exports.OIDCProvider = OIDCProvider;
OIDCProvider.defaultOptions = {
    features: {
        devInteractions: { enabled: false },
        encryption: { enabled: true },
        introspection: { enabled: true },
        revocation: { enabled: true },
        backchannelLogout: { enabled: true },
        frontchannelLogout: { enabled: true },
        sessionManagement: { enabled: true },
        webMessageResponseMode: { enabled: true },
        registration: { enabled: false },
        registrationManagement: { enabled: false },
    },
    formats: {
        AccessToken: "jwt",
    },
    // TODO: checkout utilizable methods
    // TODO: where should account management go?
    // TODO: views....... as SPA? or... how to? should separate them all?
    // TODO: dynamic clients management
    // TODO: dynamic claims schema management
    // TODO: group support?
    renderError(ctx, out, error) {
        ctx.type = "json";
        // @ts-ignore
        ctx.status = error.status || error.statusCode || 500;
        ctx.body = out;
    },
};
//# sourceMappingURL=provider.js.map
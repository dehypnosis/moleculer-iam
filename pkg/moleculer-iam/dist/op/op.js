"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const proxy_1 = require("./proxy");
class OIDCProvider {
    constructor(props, options) {
        this.props = props;
        /* lifecycle */
        this.working = false;
        const { logger = console, idp } = this.props;
        this.logger = logger;
        this.idp = idp;
        // create proxy
        const proxy = this.proxy = new proxy_1.OIDCProviderProxy({
            logger,
            idp,
        }, options);
        // assign proxy props to this instance
        return new Proxy(this, {
            get(target, prop) {
                return target[prop] || proxy[prop];
            },
        });
    }
    async start() {
        if (this.working) {
            return;
        }
        // start idp
        await this.props.idp.start();
        // start proxy
        await this.proxy.start();
        this.working = true;
        this.logger.info(`oidc provider has been started`);
    }
    async stop() {
        if (!this.working) {
            return;
        }
        // stop idp
        await this.idp.stop();
        // stop proxy
        await this.proxy.stop();
        this.working = false;
        this.logger.info(`oidc provider has been stopped`);
    }
    // set available scopes and claims dynamically
    async syncSupportedClaimsAndScopes() {
    }
}
exports.OIDCProvider = OIDCProvider;
OIDCProvider.modelNames = proxy_1.OIDCModelNames;
OIDCProvider.volatileModelNames = proxy_1.OIDCVolatileModelNames;
//# sourceMappingURL=op.js.map
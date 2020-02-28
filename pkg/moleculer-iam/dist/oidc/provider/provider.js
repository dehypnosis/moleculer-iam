"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const kleur = tslib_1.__importStar(require("kleur"));
const uuid_1 = tslib_1.__importDefault(require("uuid"));
const types_1 = require("./types");
const options_1 = require("./options");
class OIDCProvider {
    constructor(props, options) {
        this.props = props;
        /* lifecycle */
        this.working = false;
        const logger = this.logger = props.logger || console;
        const idp = props.idp;
        this.provider = options_1.parseOIDCProviderOptions({ logger, idp }, options);
    }
    get idp() {
        return this.props.idp;
    }
    get routes() {
        return this.provider.routes;
    }
    get config() {
        return this.provider.methods.configuration();
    }
    get issuer() {
        return this.provider.issuer;
    }
    async start() {
        if (this.working) {
            return;
        }
        // start idp
        await this.idp.start();
        await this.syncSupportedClaimsAndScopes();
        // start adapter
        await this.provider.adapter.start();
        this.working = true;
        this.logger.info(`oidc provider has been started`);
    }
    async stop() {
        if (!this.working) {
            return;
        }
        // stop adapter
        await this.provider.adapter.stop();
        // stop idp
        await this.idp.stop();
        this.working = false;
        this.logger.info(`oidc provider has been stopped`);
    }
    /* client management */
    get Client() {
        return this.provider.adapter.getModel("Client");
    }
    async findClient(id) {
        return this.Client.find(id);
    }
    async findClientOrFail(id) {
        const client = await this.findClient(id);
        if (!client) {
            throw new types_1.errors.InvalidClient("client_not_found");
        }
        return client;
    }
    async createClient(metadata) {
        if (metadata.client_id && await this.findClient(metadata.client_id)) {
            throw new types_1.errors.InvalidClient("client_id_duplicated");
        }
        this.logger.info(`create client ${kleur.cyan(metadata.client_id)}:`, metadata);
        const client = await this.provider.methods.clientAdd({
            ...metadata,
            client_secret: OIDCProvider.generateClientSecret(),
        }, { store: true });
        return client.metadata();
    }
    async updateClient(metadata) {
        const old = await this.findClient(metadata.client_id);
        // update client_secret
        if (metadata.reset_client_secret === true) {
            metadata = {
                ...metadata,
                client_secret: OIDCProvider.generateClientSecret(),
            };
            delete metadata.reset_client_secret;
        }
        this.logger.info(`update client ${kleur.cyan(metadata.client_id || "<unknown>")}:`, require("util").inspect(metadata));
        const client = await this.provider.methods.clientAdd({
            ...old,
            ...metadata,
        }, { store: true });
        return client.metadata();
    }
    async deleteClient(id) {
        await this.findClientOrFail(id);
        this.logger.info(`delete client ${kleur.cyan(id)}`);
        this.provider.methods.clientRemove(id);
    }
    async getClients(args) {
        return this.Client.get(args);
    }
    async countClients(args) {
        return this.Client.count(args);
    }
    static generateClientSecret() {
        return uuid_1.default().replace(/\-/g, "") + uuid_1.default().replace(/\-/g, "");
    }
    async countModels(kind, args) {
        const model = this.provider.adapter.getModel(kind);
        return model.count(args);
    }
    async getModels(kind, args) {
        const model = this.provider.adapter.getModel(kind);
        return model.get(args);
    }
    async deleteModels(kind, args) {
        const model = this.provider.adapter.getModel(kind);
        return model.delete(args);
    }
    /* dynamic claims and schema management */
    async syncSupportedClaimsAndScopes() {
        // set available scopes and claims
        const claimsSchemata = await this.idp.claims.getActiveClaimsSchemata();
        this.provider.syncSupportedClaimsAndScopes(claimsSchemata);
    }
}
exports.OIDCProvider = OIDCProvider;
/* "Session"|"AuthorizationCode"|"DeviceCode"|"AccessToken"|"RefreshToken"|"RegistrationAccessToken" management */
OIDCProvider.volatileModelNames = [
    "Session",
    "AccessToken",
    "AuthorizationCode",
    "RefreshToken",
    "DeviceCode",
    "InitialAccessToken",
    "RegistrationAccessToken",
    "Interaction",
    "ReplayDetection",
    "PushedAuthorizationRequest",
];
//# sourceMappingURL=provider.js.map
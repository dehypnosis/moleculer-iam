"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPublicClientProps = (client) => {
    if (!client)
        return undefined;
    const { client_id, client_name, client_uri, scope, logo_uri, tos_uri, policy_uri } = client.metadata();
    return { client_id, client_name, client_uri, scope, logo_uri, tos_uri, policy_uri };
};
//# sourceMappingURL=util.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getPublicClientProps(client) {
    if (!client)
        return null;
    return {
        id: client.clientId,
        name: client.clientName,
        logo: client.logoUri || null,
        tos: client.tosUri || null,
        privacy: client.policyUri || null,
        homepage: client.clientUri,
    };
}
exports.getPublicClientProps = getPublicClientProps;
//# sourceMappingURL=util.js.map
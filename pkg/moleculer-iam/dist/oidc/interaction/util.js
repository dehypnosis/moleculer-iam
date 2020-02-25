"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function getPublicClientProps(client) {
    if (!client)
        return;
    return {
        id: client.clientId,
        name: client.clientName,
        logo_uri: client.logoUri || null,
        tos_uri: client.tosUri || null,
        policy_uri: client.policyUri || null,
        client_uri: client.clientUri,
    };
}
exports.getPublicClientProps = getPublicClientProps;
async function getPublicUserProps(id) {
    if (!id)
        return;
    const { email, picture, name } = await id.claims("userinfo", "profile email");
    return {
        email,
        name: name || "unknown",
        picture: picture || null,
    };
}
exports.getPublicUserProps = getPublicUserProps;
//# sourceMappingURL=util.js.map
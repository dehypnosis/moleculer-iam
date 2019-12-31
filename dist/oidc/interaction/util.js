"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
function getPublicClientProps(client) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
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
    });
}
exports.getPublicClientProps = getPublicClientProps;
function getPublicUserProps(id) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (!id)
            return null;
        const { email, picture, name } = yield id.claims("userinfo", "profile email");
        return {
            id: id.id,
            email,
            name: name || "unknown",
            picture: picture || null,
        };
    });
}
exports.getPublicUserProps = getPublicUserProps;
//# sourceMappingURL=util.js.map
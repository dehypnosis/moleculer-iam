"use strict";
const tslib_1 = require("tslib");
const { STRING, JSON, DATE } = require("sequelize");
const OIDCModelNames = [
    "Session",
    "AccessToken",
    "AuthorizationCode",
    "RefreshToken",
    "DeviceCode",
    "ClientCredentials",
    "Client",
    "InitialAccessToken",
    "RegistrationAccessToken",
    "Interaction",
    "ReplayDetection",
    "PushedAuthorizationRequest",
];
const OIDCGrantModelNames = [
    "AccessToken",
    "AuthorizationCode",
    "RefreshToken",
    "DeviceCode",
];
module.exports = {
    up: (queryInterface, Sequelize) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        for (const modelName of OIDCModelNames) {
            yield queryInterface.createTable(modelName, Object.assign(Object.assign(Object.assign(Object.assign({ id: { type: STRING, primaryKey: true } }, (OIDCGrantModelNames.includes(modelName) ? { grantId: { type: STRING } } : undefined)), (modelName === "DeviceCode" ? { userCode: { type: STRING } } : undefined)), (modelName === "Session" ? { uid: { type: STRING } } : undefined)), { data: { type: JSON }, createdAt: { type: DATE }, consumedAt: { type: DATE }, expiresAt: { type: DATE }, updatedAt: { type: DATE } }));
        }
    }),
    down: (queryInterface, Sequelize) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        for (const modelName of OIDCModelNames) {
            yield queryInterface.dropTable(modelName);
        }
    }),
};
//# sourceMappingURL=20191127022419-initialModels.js.map
"use strict";

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
  up: async (queryInterface, Sequelize) => {
    for (const modelName of OIDCModelNames) {
      await queryInterface.createTable(modelName, {
        id: {type: STRING, primaryKey: true},
        ...(OIDCGrantModelNames.includes(modelName) ? {grantId: {type: STRING}} : undefined),
        ...(modelName === "DeviceCode" ? {userCode: {type: STRING}} : undefined),
        ...(modelName === "Session" ? {uid: {type: STRING}} : undefined),
        data: {type: JSON},
        createdAt: {type: DATE},
        consumedAt: {type: DATE},
        expiresAt: {type: DATE},
        updatedAt: {type: DATE},
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    for (const modelName of OIDCModelNames) {
      await queryInterface.dropTable(modelName);
    }
  },
};

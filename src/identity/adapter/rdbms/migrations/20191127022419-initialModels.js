"use strict";

const { STRING, JSON, DATE } = require("sequelize");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // await queryInterface.createTable(modelName, {
    //   id: {type: STRING, primaryKey: true},
    //   ...(OIDCGrantModelNames.includes(modelName) ? {grantId: {type: STRING}} : undefined),
    //   ...(modelName === "DeviceCode" ? {userCode: {type: STRING}} : undefined),
    //   ...(modelName === "Session" ? {uid: {type: STRING}} : undefined),
    //   data: {type: JSON},
    //   createdAt: {type: DATE},
    //   consumedAt: {type: DATE},
    //   expiresAt: {type: DATE},
    //   updatedAt: {type: DATE},
    // });
  },

  down: async (queryInterface, Sequelize) => {
    // await queryInterface.dropTable(modelName);
  },
};

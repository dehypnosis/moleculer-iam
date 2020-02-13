"use strict";

const { STRING, JSON, INTEGER, DATE, fn } = require("sequelize");

const TABLE = "IdentityClaimsMigrationLock";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(TABLE, "updatedAt", {type: DATE, defaultValue: fn("NOW")});
    await queryInterface.addColumn(TABLE, "number", {type: INTEGER, defaultValue: 0});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(TABLE, "number");
    await queryInterface.removeColumn(TABLE, "updatedAt");
  },
};

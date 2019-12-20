"use strict";

const { STRING, JSON, DATE, fn } = require("sequelize");

const TABLE = "IdentityClaims";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(TABLE, {
      id: {type: STRING, primaryKey: true},
      key: {type: STRING, primaryKey: true},
      schemaVersion: {type: STRING, primaryKey: true},
      value: {type: JSON, allowNull: true},
      createdAt: {type: DATE, defaultValue: fn("NOW")},
    }, {
      charset: "utf8",
      collate: "utf8_general_ci",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable(TABLE);
  },
};

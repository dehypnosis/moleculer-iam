"use strict";

const { STRING, JSON, DATE, TEXT, BOOLEAN, fn } = require("sequelize");

const TABLE = "IdentityClaimsSchema";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(TABLE, {
      key: {type: STRING, primaryKey: true},
      scope: {type: STRING},
      version: {type: STRING, primaryKey: true},
      parentVersion: {type: STRING, allowNull: true},
      description: {type: TEXT, allowNull: true},
      validation: {type: JSON},
      migration: {type: TEXT},
      seed: {type: JSON, allowNull: true},
      active: {type: BOOLEAN, defaultValue: false},
      createdAt: {type: DATE, defaultValue: fn("NOW")},
    }, {
      charset: "utf8",
      collate: "utf8_general_ci",
    });
    await queryInterface.addIndex(TABLE, ["scope"]);
    await queryInterface.addIndex(TABLE, ["key", "active"]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable(TABLE);
  },
};

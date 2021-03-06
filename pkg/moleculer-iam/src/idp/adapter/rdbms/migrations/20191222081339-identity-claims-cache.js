"use strict";

const { STRING, JSON, DATE, fn } = require("sequelize");

const TABLE = "IdentityClaimsCache";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(TABLE, {
      id: {type: STRING, primaryKey: true},
      data: {type: JSON},
      createdAt: {type: DATE, defaultValue: fn("NOW")},
      updatedAt: {type: DATE, defaultValue: fn("NOW")},
    }, {
      charset: "utf8",
      collate: "utf8_general_ci",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable(TABLE);
  },
};

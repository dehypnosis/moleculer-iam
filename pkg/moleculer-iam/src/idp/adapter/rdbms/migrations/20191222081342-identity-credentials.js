"use strict";

const { STRING, JSON, DATE, fn } = require("sequelize");

const TABLE = "IdentityCredentials";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(TABLE, {
      id: {type: STRING, primaryKey: true},
      password: {type: STRING},
      updatedAt: {type: DATE, defaultValue: fn("NOW")},
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

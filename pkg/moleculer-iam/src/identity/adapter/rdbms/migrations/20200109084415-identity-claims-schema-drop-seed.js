"use strict";

const { STRING, JSON, DATE, TEXT, BOOLEAN, fn } = require("sequelize");

const TABLE = "IdentityClaimsSchema";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(TABLE, "seed");
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(TABLE, "seed", {type: JSON, allowNull: true});
  },
};

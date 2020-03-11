"use strict";
const { STRING, JSON, DATE, TEXT, BOOLEAN, fn } = require("sequelize");
const TABLE = "IdentityClaimsSchema";
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn(TABLE, "immutable", { type: BOOLEAN, defaultValue: false });
        await queryInterface.addColumn(TABLE, "unique", { type: BOOLEAN, defaultValue: false });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn(TABLE, "immutable");
        await queryInterface.removeColumn(TABLE, "unique");
    },
};
//# sourceMappingURL=20200110084415-identity-claims-schema-add-immutable-and-unique.js.map
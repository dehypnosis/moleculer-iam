"use strict";
const { STRING, JSON, DATE, fn } = require("sequelize");
const TABLE = "IdentityClaimsMigrationLock";
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable(TABLE, {
            key: { type: STRING, primaryKey: true },
            createdAt: { type: DATE, defaultValue: fn("NOW") },
        }, {
            charset: "utf8",
            collate: "utf8_general_ci",
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable(TABLE);
    },
};
//# sourceMappingURL=20191222081341-identity-claims-migration-lock.js.map
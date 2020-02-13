"use strict";
const tslib_1 = require("tslib");
const { STRING, JSON, DATE, TEXT, BOOLEAN, fn } = require("sequelize");
const TABLE = "IdentityClaimsSchema";
module.exports = {
    up: (queryInterface, Sequelize) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        yield queryInterface.createTable(TABLE, {
            key: { type: STRING, primaryKey: true },
            scope: { type: STRING },
            version: { type: STRING, primaryKey: true },
            parentVersion: { type: STRING, allowNull: true },
            description: { type: TEXT, allowNull: true },
            validation: { type: JSON },
            migration: { type: TEXT },
            seed: { type: JSON, allowNull: true },
            active: { type: BOOLEAN, defaultValue: false },
            createdAt: { type: DATE, defaultValue: fn("NOW") },
        }, {
            charset: "utf8",
            collate: "utf8_general_ci",
        });
        yield queryInterface.addIndex(TABLE, ["scope"]);
        yield queryInterface.addIndex(TABLE, ["key", "active"]);
    }),
    down: (queryInterface, Sequelize) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        yield queryInterface.dropTable(TABLE);
    }),
};
//# sourceMappingURL=20191220084415-identity-claims-schema.js.map
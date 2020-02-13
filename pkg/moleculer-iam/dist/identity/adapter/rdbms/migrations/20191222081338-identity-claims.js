"use strict";
const tslib_1 = require("tslib");
const { STRING, JSON, DATE, fn } = require("sequelize");
const TABLE = "IdentityClaims";
module.exports = {
    up: (queryInterface, Sequelize) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        yield queryInterface.createTable(TABLE, {
            id: { type: STRING, primaryKey: true },
            key: { type: STRING, primaryKey: true },
            schemaVersion: { type: STRING, primaryKey: true },
            value: { type: JSON, allowNull: true },
            createdAt: { type: DATE, defaultValue: fn("NOW") },
        }, {
            charset: "utf8",
            collate: "utf8_general_ci",
        });
    }),
    down: (queryInterface, Sequelize) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        yield queryInterface.dropTable(TABLE);
    }),
};
//# sourceMappingURL=20191222081338-identity-claims.js.map
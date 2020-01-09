"use strict";
const tslib_1 = require("tslib");
const { STRING, JSON, DATE, TEXT, BOOLEAN, fn } = require("sequelize");
const TABLE = "IdentityClaimsSchema";
module.exports = {
    up: (queryInterface, Sequelize) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        yield queryInterface.removeColumn(TABLE, "seed");
    }),
    down: (queryInterface, Sequelize) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        yield queryInterface.addColumn(TABLE, "seed", { type: JSON, allowNull: true });
    }),
};
//# sourceMappingURL=20200109084415-identity-claims-schema-drop-seed.js.map
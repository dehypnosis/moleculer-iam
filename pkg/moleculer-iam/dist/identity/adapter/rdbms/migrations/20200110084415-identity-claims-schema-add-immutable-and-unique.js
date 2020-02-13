"use strict";
const tslib_1 = require("tslib");
const { STRING, JSON, DATE, TEXT, BOOLEAN, fn } = require("sequelize");
const TABLE = "IdentityClaimsSchema";
module.exports = {
    up: (queryInterface, Sequelize) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        yield queryInterface.addColumn(TABLE, "immutable", { type: BOOLEAN, defaultValue: false });
        yield queryInterface.addColumn(TABLE, "unique", { type: BOOLEAN, defaultValue: false });
    }),
    down: (queryInterface, Sequelize) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        yield queryInterface.removeColumn(TABLE, "immutable");
        yield queryInterface.removeColumn(TABLE, "unique");
    }),
};
//# sourceMappingURL=20200110084415-identity-claims-schema-add-immutable-and-unique.js.map
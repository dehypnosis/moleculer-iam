"use strict";
const tslib_1 = require("tslib");
const { STRING, JSON, INTEGER, DATE, fn } = require("sequelize");
const TABLE = "IdentityClaimsMigrationLock";
module.exports = {
    up: (queryInterface, Sequelize) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        yield queryInterface.addColumn(TABLE, "updatedAt", { type: DATE, defaultValue: fn("NOW") });
        yield queryInterface.addColumn(TABLE, "number", { type: INTEGER, defaultValue: 0 });
    }),
    down: (queryInterface, Sequelize) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        yield queryInterface.removeColumn(TABLE, "number");
        yield queryInterface.removeColumn(TABLE, "updatedAt");
    }),
};
//# sourceMappingURL=20191222081343-identity-claims-migration-lock-number.js.map
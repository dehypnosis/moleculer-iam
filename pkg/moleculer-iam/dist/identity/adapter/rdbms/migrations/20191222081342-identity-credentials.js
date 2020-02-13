"use strict";
const tslib_1 = require("tslib");
const { STRING, JSON, DATE, fn } = require("sequelize");
const TABLE = "IdentityCredentials";
module.exports = {
    up: (queryInterface, Sequelize) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        yield queryInterface.createTable(TABLE, {
            id: { type: STRING, primaryKey: true },
            password: { type: STRING },
            updatedAt: { type: DATE, defaultValue: fn("NOW") },
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
//# sourceMappingURL=20191222081342-identity-credentials.js.map
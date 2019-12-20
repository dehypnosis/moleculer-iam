"use strict";
const tslib_1 = require("tslib");
const TABLE = "IdentityCache";
module.exports = {
    up: (queryInterface, Sequelize) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        yield queryInterface.sequelize.query(`
      create or replace view ${TABLE} as (
        select c.id, c.data claims, m.data metadata, c.createdAt, c.updatedAt from IdentityClaimsCache c inner join IdentityMetadata m on c.id = m.id
      );
    `);
    }),
    down: (queryInterface, Sequelize) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        yield queryInterface.sequelize.query(`
      drop view if exists ${TABLE}
    `);
    }),
};
//# sourceMappingURL=20191222081340-identity-cache.js.map
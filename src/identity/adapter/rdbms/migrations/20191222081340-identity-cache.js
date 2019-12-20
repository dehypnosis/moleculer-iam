"use strict";

const TABLE = "IdentityCache";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      create or replace view ${TABLE} as (
        select c.id, c.data claims, m.data metadata, c.createdAt, c.updatedAt from IdentityClaimsCache c inner join IdentityMetadata m on c.id = m.id
      );
    `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      drop view if exists ${TABLE}
    `);
  },
};

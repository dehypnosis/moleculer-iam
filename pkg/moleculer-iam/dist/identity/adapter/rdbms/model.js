"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rdbms_1 = require("../../../helper/rdbms");
const { STRING, JSON, DATE, BOOLEAN, TEXT, INTEGER } = rdbms_1.DataTypes;
async function defineAdapterModels(manager) {
    const IdentityClaimsSchema = await manager.define("IdentityClaimsSchema", {
        key: { type: STRING, primaryKey: true },
        scope: { type: STRING },
        version: { type: STRING, primaryKey: true },
        parentVersion: { type: STRING, allowNull: true },
        description: { type: TEXT, allowNull: true },
        validation: { type: JSON },
        immutable: { type: BOOLEAN, defaultValue: false },
        unique: { type: BOOLEAN, defaultValue: false },
        migration: { type: TEXT },
        active: { type: BOOLEAN, defaultValue: false },
        createdAt: { type: DATE },
    }, {
        freezeTableName: true,
        updatedAt: false,
    });
    const IdentityMetadata = await manager.define("IdentityMetadata", {
        id: { type: STRING, primaryKey: true },
        data: { type: JSON },
        createdAt: { type: DATE },
        updatedAt: { type: DATE },
    }, {
        freezeTableName: true,
    });
    const IdentityClaims = await manager.define("IdentityClaims", {
        id: { type: STRING, primaryKey: true },
        key: { type: STRING, primaryKey: true },
        schemaVersion: { type: STRING, primaryKey: true },
        value: { type: JSON, allowNull: true },
        createdAt: { type: DATE },
    }, {
        updatedAt: false,
        freezeTableName: true,
    });
    const IdentityClaimsCache = await manager.define("IdentityClaimsCache", {
        id: { type: STRING, primaryKey: true },
        data: { type: JSON },
        createdAt: { type: DATE },
        updatedAt: { type: DATE },
    }, {
        freezeTableName: true,
    });
    const IdentityCache = await manager.define("IdentityCache", {
        id: { type: STRING, primaryKey: true },
        claims: { type: JSON },
        metadata: { type: JSON },
        createdAt: { type: DATE },
        updatedAt: { type: DATE },
    }, {
        freezeTableName: true,
    });
    const IdentityClaimsMigrationLock = await manager.define("IdentityClaimsMigrationLock", {
        key: { type: STRING, primaryKey: true },
        number: { type: INTEGER },
        updatedAt: { type: DATE },
        createdAt: { type: DATE },
    }, {
        freezeTableName: true,
        updatedAt: false,
    });
    const IdentityCredentials = await manager.define("IdentityCredentials", {
        id: { type: STRING, primaryKey: true },
        password: { type: STRING },
        createdAt: { type: DATE },
        updatedAt: { type: DATE },
    }, {
        freezeTableName: true,
    });
    return {
        IdentityClaimsSchema,
        IdentityMetadata,
        IdentityClaims,
        IdentityClaimsCache,
        IdentityCache,
        IdentityClaimsMigrationLock,
        IdentityCredentials,
    };
}
exports.defineAdapterModels = defineAdapterModels;
//# sourceMappingURL=model.js.map
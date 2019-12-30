"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const rdbms_1 = require("../../../helper/rdbms");
const { STRING, JSON, DATE, BOOLEAN, TEXT, INTEGER } = rdbms_1.DataTypes;
function defineAdapterModels(manager) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const IdentityClaimsSchema = yield manager.define("IdentityClaimsSchema", {
            key: { type: STRING, primaryKey: true },
            scope: { type: STRING },
            version: { type: STRING, primaryKey: true },
            parentVersion: { type: STRING, allowNull: true },
            description: { type: TEXT, allowNull: true },
            validation: { type: JSON },
            migration: { type: TEXT },
            seed: { type: JSON, allowNull: true },
            active: { type: BOOLEAN, defaultValue: false },
            createdAt: { type: DATE },
        }, {
            freezeTableName: true,
            updatedAt: false,
        });
        const IdentityMetadata = yield manager.define("IdentityMetadata", {
            id: { type: STRING, primaryKey: true },
            data: { type: JSON },
            createdAt: { type: DATE },
            updatedAt: { type: DATE },
        }, {
            freezeTableName: true,
        });
        const IdentityClaims = yield manager.define("IdentityClaims", {
            id: { type: STRING, primaryKey: true },
            key: { type: STRING, primaryKey: true },
            schemaVersion: { type: STRING, primaryKey: true },
            value: { type: JSON, allowNull: true },
            createdAt: { type: DATE },
        }, {
            updatedAt: false,
            freezeTableName: true,
        });
        const IdentityClaimsCache = yield manager.define("IdentityClaimsCache", {
            id: { type: STRING, primaryKey: true },
            data: { type: JSON },
            createdAt: { type: DATE },
            updatedAt: { type: DATE },
        }, {
            freezeTableName: true,
        });
        const IdentityCache = yield manager.define("IdentityCache", {
            id: { type: STRING, primaryKey: true },
            claims: { type: JSON },
            metadata: { type: JSON },
            createdAt: { type: DATE },
            updatedAt: { type: DATE },
        }, {
            freezeTableName: true,
        });
        const IdentityClaimsMigrationLock = yield manager.define("IdentityClaimsMigrationLock", {
            key: { type: STRING, primaryKey: true },
            number: { type: INTEGER },
            updatedAt: { type: DATE },
            createdAt: { type: DATE },
        }, {
            freezeTableName: true,
            updatedAt: false,
        });
        const IdentityCredentials = yield manager.define("IdentityCredentials", {
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
    });
}
exports.defineAdapterModels = defineAdapterModels;
//# sourceMappingURL=model.js.map
import { RDBMSManager } from "../../../helper/rdbms";
export declare function defineAdapterModels(manager: RDBMSManager): Promise<{
    IdentityClaimsSchema: import("../../../helper/rdbms").ModelClass;
    IdentityMetadata: import("../../../helper/rdbms").ModelClass;
    IdentityClaims: import("../../../helper/rdbms").ModelClass;
    IdentityClaimsCache: import("../../../helper/rdbms").ModelClass;
    IdentityCache: import("../../../helper/rdbms").ModelClass;
    IdentityClaimsMigrationLock: import("../../../helper/rdbms").ModelClass;
    IdentityCredentials: import("../../../helper/rdbms").ModelClass;
}>;

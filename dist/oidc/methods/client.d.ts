import { FindOptions } from "../../helper/rdbms";
import { ClientMetadata, OIDCProviderBase } from "../base";
export declare function createClientMethods(base: OIDCProviderBase): {
    find(id: string): Promise<ClientMetadata | undefined>;
    findOrFail(id: string): Promise<ClientMetadata>;
    create(metadata: ClientMetadata): Promise<ClientMetadata>;
    update(metadata: ClientMetadata): Promise<ClientMetadata>;
    remove(id: string): Promise<void>;
    get(opts?: FindOptions | undefined): Promise<ClientMetadata[]>;
    count(): Promise<number>;
};

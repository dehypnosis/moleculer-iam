import { ServiceSchema } from "moleculer";
import { IdentityProviderOptions } from "../idp";
import { OIDCProviderOptions } from "../op";
import { IAMServerOptions } from "../server";
export declare type IAMServiceSchemaOptions = {
    idp: IdentityProviderOptions;
    op: OIDCProviderOptions;
    server: IAMServerOptions;
};
export declare function IAMServiceSchema(opts: IAMServiceSchemaOptions): ServiceSchema;

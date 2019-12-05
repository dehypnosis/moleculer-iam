import { ServiceSchema } from "moleculer";
import { IdentityProviderOptions } from "../identity";
import { OIDCProviderOptions } from "../oidc";
import { IAMServerOptions } from "../server";
export declare type IAMServiceSchemaOptions = {
    idp: IdentityProviderOptions;
    oidc: OIDCProviderOptions;
    server: IAMServerOptions;
};
export declare function IAMServiceSchema(opts: IAMServiceSchemaOptions): ServiceSchema;

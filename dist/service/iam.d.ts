import { ServiceSchema } from "moleculer";
import { IdentityProvider } from "../identity";
import { OIDCProvider } from "../oidc";
export declare function IAMServiceSchema(oidc: OIDCProvider, identity?: IdentityProvider): ServiceSchema;

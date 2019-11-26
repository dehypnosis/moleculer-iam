import { ServiceSchema } from "moleculer";
import { OIDCProviderOptions, OIDCProviderProps } from "../oidc";
export declare function createIAMServiceSchema(providerProps: Omit<OIDCProviderProps, "logger">, providerOptions?: OIDCProviderOptions): ServiceSchema;

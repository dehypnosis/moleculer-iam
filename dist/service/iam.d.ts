import { ServiceSchema } from "moleculer";
import { OIDCProviderOptions, OIDCProviderProps } from "../provider";
export declare function createIAMServiceSchema(providerProps: Omit<OIDCProviderProps, "logger">, providerOptions?: OIDCProviderOptions): ServiceSchema;

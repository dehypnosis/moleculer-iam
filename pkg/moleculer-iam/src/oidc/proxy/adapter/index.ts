import { OIDCMemoryAdapterProxy, OIDCMemoryAdapterProxyOptions } from "./memory";
import { OIDCRDBMSAdapterProxy, OIDCRDBMSAdapterProxyOptions } from "./rdbms";

export { OIDCAdapterProxy } from "./adapter";

export const OIDCAdapterProxyConstructors = {
  Memory: OIDCMemoryAdapterProxy,
  RDBMS: OIDCRDBMSAdapterProxy,
};

export type OIDCAdapterProxyConstructorOptions = {
  type: "Memory",
  options?: OIDCMemoryAdapterProxyOptions,
} | {
  type: "RDBMS",
  options: OIDCRDBMSAdapterProxyOptions,
};

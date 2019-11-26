import * as kleur from "kleur";
import { Provider } from "./types";
import { Logger } from "../../logger";

export type OIDCProviderBaseDebugOptions = {
  [key in "disable-implicit-force-https" | "disable-implicit-forbid-localhost"]: boolean;
};

// it makes side-effects for provider
// ref: https://github.com/panva/node-oidc-provider/tree/master/recipes#oidc-provider-recipes
export function applyDebugOptions(provider: Provider, logger: Logger, options: OIDCProviderBaseDebugOptions) {

  // extend client schema validation
  if (options["disable-implicit-force-https"] || options["disable-implicit-forbid-localhost"]) {
    // @ts-ignore
    const invalidateClientSchema = provider.Client.Schema.prototype.invalidate;

    // @ts-ignore
    provider.Client.Schema.prototype.invalidate = function(message: any, code: string) {
      if (code === "implicit-force-https" || code === "implicit-forbid-localhost") {
        logger.warn(`ignore error ${kleur.red(code)} for debugging purpose in client ${kleur.cyan(this.client_id)} schema validation`);
        return;
      }
      invalidateClientSchema.call(this, message);
    };
  }
}

/*
 * moleculer-iam
 * Copyright (c) 2019 QMIT Inc. (https://github.com/qmit-pro/moleculer-iam)
 * MIT Licensed
 */

import { ServiceSchema, Errors } from "moleculer";
import { OIDCProvider, OIDCProviderOptions, OIDCProviderProps, OIDCErrors } from "../provider";
import { IAMServiceActionParams } from "./iam.params";
import uuid from "uuid";

export function createIAMServiceSchema(providerProps: Omit<OIDCProviderProps, "logger">, providerOptions?: OIDCProviderOptions): ServiceSchema {
  return {
    name: "iam",
    settings: {},
    actions: {
      /* Client Management */
      "client.create": {
        description: `
          Create OIDC Client. All params from below reference will be accepted.
          ref: https://openid.net/specs/openid-connect-registration-1_0.html#ClientMetadata
        `,
        params: IAMServiceActionParams["client.create"],
        async handler(ctx) {
          const provider = this.provider as OIDCProvider;
          try {
            if (ctx.params) {
              (ctx.params as any).client_secret = this.generateClientSecret();
            }
            const client = await provider.createClient(ctx.params as any);
            return client;
          } catch (error) {
            throw this.transformError(error);
          }
        },
      },
      "client.update": {
        params: IAMServiceActionParams["client.update"],
        async handler(ctx) {
          const provider = this.provider as OIDCProvider;
          try {
            const old = await provider.findClientOrFail((ctx.params as any).client_id);
            const payload = (ctx.params as any);
            // regen client_secret
            if (payload.client_secret === true) {
              payload.client_secret = this.generateClientSecret();
            } else {
              delete payload.client_secret;
            }
            const client = await provider.updateClient({...old.metadata(), ...payload});
            return client;
          } catch (error) {
            throw this.transformError(error);
          }
        },
      },
      "client.remove": {
        params: {},
        handler(ctx) {
          return "Hello " + ((ctx.params! as any).name || "Anonymous");
        },
      },
    },
    methods: {
      transformError(err: OIDCErrors.OIDCProviderError): Errors.MoleculerError {
        if (err.status <= 400 && err.status < 500) {
          return new Errors.MoleculerClientError(err.error_description!, err.statusCode, err.error);
        } else if (err.status >= 500) {
          return new Errors.MoleculerServerError(err.error_description!, err.statusCode, err.error);
        }
        return err as any;
      },
      generateClientSecret(): string {
        return uuid().replace(/\-/g, "");
      },
    },

    created() {
      this.provider = new OIDCProvider({
        ...providerProps,
        logger: this.broker.getLogger("OIDC"),
      }, providerOptions);
    },

    async started() {
      this.provider.start();
    },
    async stopped() {
      this.provider.stop();
    },
  };
}

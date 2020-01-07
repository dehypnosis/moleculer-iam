/*
 * moleculer-iam
 * Copyright (c) 2019 QMIT Inc. (https://github.com/qmit-pro/moleculer-iam)
 * MIT Licensed
 */

import { Errors, ServiceSchema } from "moleculer";
import { IdentityProvider, IdentityProviderOptions } from "../identity";
import { OIDCProvider, errors as OIDCErrors, OIDCProviderOptions } from "../oidc";
import { IAMServer, IAMServerOptions } from "../server";
import { IAMServiceActionParams } from "./params";

export type IAMServiceSchemaOptions = {
  idp: IdentityProviderOptions,
  oidc: OIDCProviderOptions,
  server: IAMServerOptions,
};

export function IAMServiceSchema(opts: IAMServiceSchemaOptions): ServiceSchema {
  let idp: IdentityProvider;
  let oidc: OIDCProvider;
  let server: IAMServer;

  return {
    created() {
      // create identity provider
      idp = this.idp = new IdentityProvider({
        logger: this.broker.getLogger("idp"),
      }, opts.idp);

      // create oidc provider
      oidc = this.oidc = new OIDCProvider({
        idp,
        logger: this.broker.getLogger("oidc"),
      }, opts.oidc);

      // create server
      server = this.server = new IAMServer({
        oidc,
        logger: this.broker.getLogger("server"),
      }, opts.server);
    },
    async started() {
      await server.start();
      await this.clearCache("client.**");
    },
    async stopped() {
      await server.stop();
    },

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
          try {
            const client = await oidc.client.create(ctx.params as any);
            await this.clearCache("client.**");
            return client;
          } catch (error) {
            throw this.transformOIDCError(error);
          }
        },
      },
      "client.update": {
        params: IAMServiceActionParams["client.update"],
        async handler(ctx) {
          try {
            const client = await oidc.client.update(ctx.params as any);
            await this.clearCache("client.**");
            return client;
          } catch (error) {
            throw this.transformOIDCError(error);
          }
        },
      },
      "client.delete": {
        params: {
          client_id: "string",
        },
        async handler(ctx) {
          try {
            await oidc.client.delete((ctx.params as any).client_id);
            await this.clearCache("client.**");
            return true;
          } catch (error) {
            throw this.transformOIDCError(error);
          }
        },
      },
      "client.find": {
        cache: {
          ttl: 3600,
        },
        params: {
          client_id: "string",
        },
        async handler(ctx) {
          try {
            return await oidc.client.findOrFail((ctx.params as any).client_id);
          } catch (error) {
            throw this.transformOIDCError(error);
          }
        },
      },
      "client.get": {
        cache: {
          ttl: 3600,
        },
        params: {
          offset: {
            type: "number",
            positive: true,
            default: 0,
          },
          limit: {
            type: "number",
            positive: true,
            default: 10,
          },
        },
        async handler(ctx) {
          try {
            const {offset, limit} = ctx.params! as any;
            const [total, entries] = await Promise.all([
              oidc.client.count(),
              oidc.client.get({offset, limit}),
            ]);
            return {offset, limit, total, entries};
          } catch (error) {
            throw this.transformOIDCError(error);
          }
        },
      },
      "client.count": {
        async handler(ctx) {
          try {
            return await oidc.client.count();
          } catch (error) {
            throw this.transformOIDCError(error);
          }
        },
      },

      // /* Token Management */
      // "token.getCode": {},
      // "token.getAccessToken": {},
      // "token.getRefreshToken": {},
      // "token.revokeCode": {},
      // "token.revokeAccessToken": {},
      // "token.revokeRefreshToken": {},
      // "token.revokeAll": {},
      //
      // /* Identity Management */
      // "identity.get": {},
      // "identity.count": {},
      // "identity.find": {},
      // "identity.create": {},
      // "identity.validate": {},
      // "identity.update": {},
      // "identity.delete": {},
      // "identity.restore": {},
      // "identity.refresh": {},
      //
      // /* Identity Claims Schema Management */
      // "identity.getSchemata": {},
      // "identity.defineSchema": {},
      // "identity.findSchema": {},
    },

    methods: {
      transformOIDCError(err: OIDCErrors.OIDCProviderError): Errors.MoleculerError {
        if (err.status <= 400 && err.status < 500) {
          return new Errors.MoleculerClientError(err.error_description!, err.statusCode, err.error);
        } else if (err.status >= 500) {
          return new Errors.MoleculerServerError(err.error_description!, err.statusCode, err.error);
        }
        return err as any;
      },
      async clearCache(...keys: string[]) {
        if (this.broker.cacher) {
          if (keys.length === 0) {
            keys = ["**"];
          }
          const fullKeys = keys.map(key => `${this.fullName}.${key}`);
          await this.broker.cacher.clean(fullKeys);
        }
      },
    },
  };
}

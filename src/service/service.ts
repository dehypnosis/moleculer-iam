/*
 * moleculer-iam
 * Copyright (c) 2019 QMIT Inc. (https://github.com/qmit-pro/moleculer-iam)
 * MIT Licensed
 */

import { Errors, ServiceSchema } from "moleculer";
import { IdentityProvider, IdentityProviderOptions, IdentityClaimsSchemaPayload } from "../identity";
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
            const client = await oidc.createClient(ctx.params as any);
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
            const client = await oidc.updateClient(ctx.params as any);
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
            await oidc.deleteClient((ctx.params as any).client_id);
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
            return await oidc.findClientOrFail((ctx.params as any).client_id);
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
          where: {
            type: "any",
            optional: true,
          },
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
            const {offset, limit, where} = ctx.params! as any;
            const [total, entries] = await Promise.all([
              oidc.countClients(where),
              oidc.getClients(ctx.params),
            ]);
            return {offset, limit, total, entries};
          } catch (error) {
            throw this.transformOIDCError(error);
          }
        },
      },
      "client.count": {
        cache: {
          ttl: 3600,
        },
        params: {
          where: {
            type: "any",
            optional: true,
          },
        },
        async handler(ctx) {
          try {
            return await oidc.countClients(ctx.params && (ctx.params as any).where);
          } catch (error) {
            throw this.transformOIDCError(error);
          }
        },
      },

      /* "Session", "AccessToken", "AuthorizationCode", "RefreshToken", "DeviceCode", "InitialAccessToken", "RegistrationAccessToken", "Interaction", "ReplayDetection", "PushedAuthorizationRequest" Management */
      "model.get": {
        cache: {
          ttl: 30,
        },
        params: {
          kind: {
            type: "enum",
            values: OIDCProvider.volatileModelNames,
          },
          where: {
            type: "any",
            optional: true,
          },
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
          const {offset, limit, kind, where, ...args} = ctx.params! as any;
          const [total, entries] = await Promise.all([
            oidc.countModels(kind, where),
            oidc.getModels(kind, { offset, limit, where, ...args}),
          ]);
          return {offset, limit, total, entries};
        },
      },
      "model.count": {
        cache: {
          ttl: 30,
        },
        params: {
          kind: {
            type: "enum",
            values: OIDCProvider.volatileModelNames,
          },
          where: {
            type: "any",
            optional: true,
          },
        },
        async handler(ctx) {
          const {kind, where} = ctx.params! as any;
          return oidc.countModels(kind, where);
        },
      },
      "model.delete": {
        params: {
          kind: {
            type: "enum",
            values: OIDCProvider.volatileModelNames,
          },
          where: {
            type: "any",
            optional: false,
          },
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
          const {kind, ...args} = ctx.params! as any;
          return oidc.deleteModels(kind, args);
        },
      },

      // /* Identity Management */
      // "identity.validate": {},
      // "identity.create": {},
      // "identity.update": {},
      // "identity.delete": {},
      // "identity.restore": {},
      // "identity.find": {},
      // "identity.get": {},
      // "identity.count": {},
      // "identity.refresh": {},
      //
      // /* Identity Claims Schema Management */
      "schema.get": {
        params: {
          scope: {
            type: "array",
            items: {
              type: "string",
              trim: true,
              empty: false,
            },
            default: [],
          },
          key: {
            type: "string",
            empty: false,
            trim: true,
            optional: true,
          },
          version: {
            type: "string",
            empty: false,
            trim: true,
            optional: true,
          },
          active: {
            type: "boolean",
            optional: true,
          },
        },
        async handler(ctx) {
          return idp.claims.getClaimsSchemata(ctx.params as any);
        },
      },
      "schema.find": {
        params: {
          key: {
            type: "string",
            empty: false,
            trim: true,
          },
          version: {
            type: "string",
            empty: false,
            trim: true,
            optional: true,
          },
          active: {
            type: "boolean",
            optional: true,
          },
        },
        async handler(ctx) {
          return idp.claims.getClaimsSchema(ctx.params as any);
        },
      },
      "schema.define": {
        params: IAMServiceActionParams["schema.define"],
        async handler(ctx) {
          return idp.claims.defineClaimsSchema(ctx.params as IdentityClaimsSchemaPayload);
        },
      },
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

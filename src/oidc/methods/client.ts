import * as kleur from "kleur";
import { FindOptions } from "../../helper/rdbms";
import { errors, Client, ClientMetadata, OIDCProviderBase } from "../base";

export function createClientMethods(base : OIDCProviderBase) {
  const model = base.getModel<ClientMetadata>("Client");
  return {
    async find(id: string) {
      return model.find(id);
    },

    async findOrFail(id: string) {
      const client = await this.find(id);
      if (!client) {
        throw new errors.InvalidClient("client not found");
      }
      return client;
    },

    async create(metadata: ClientMetadata) {
      if (metadata.client_id && await this.find(metadata.client_id)) {
        throw new errors.InvalidClient("client_id is duplicated");
      }
      base.logger.info(`create client ${kleur.cyan(metadata.client_id)}:`, metadata);

      const client = await base.originalMap.clientAdd(metadata, {store: true}) as Client;
      return client.metadata();
    },

    async update(metadata: ClientMetadata) {
      await this.find(metadata.client_id);
      base.logger.info(`update client ${kleur.cyan(metadata.client_id || "<unknown>")}:`, metadata);
      const client = await base.originalMap.clientAdd(metadata, {store: true}) as Client;
      return client.metadata();
    },

    async remove(id: string) {
      await this.findOrFail(id);
      base.logger.info(`remove client ${kleur.cyan(id)}`);
      base.originalMap.clientRemove(id);
    },

    async get(opts?: FindOptions) {
      return await model.get(opts);
    },

    async count() {
      return model.count();
    },
  };
}

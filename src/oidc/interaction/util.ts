import { Client } from "../provider";

export function getPublicClientProps(client?: Client) {
  if (!client) return undefined;
  const { client_id, client_name, client_uri = null, scope = null, logo_uri = null, tos_uri = null, policy_uri = null } = client.metadata();
  return { client_id, client_name, client_uri, scope, logo_uri, tos_uri, policy_uri };
};

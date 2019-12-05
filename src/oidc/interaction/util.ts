import { Client } from "../provider";

export function getPublicClientProps(client: Client) {
  if (!client) return null;
  return {
    id: client.clientId,
    name: client.clientName,
    logo: client.logoUri || null,
    tos: client.tosUri || null,
    privacy: client.policyUri || null,
    homepage: client.clientUri,
  };
}

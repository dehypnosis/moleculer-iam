import { Client } from "../provider";
import { Identity } from "../../identity";

export async function getPublicClientProps(client: Client) {
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

export async function getPublicUserProps(id: Identity) {
  if (!id) return null;
  const {email, picture, preferred_username, nickname, name} = await id.claims("id_token", "profile email");
  return {
    id: id.id,
    email,
    name: preferred_username || nickname || name || "unknown",
    picture: picture || null,
  };
}

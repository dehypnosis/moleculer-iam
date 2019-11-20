"use strict";

import { ServiceBroker } from "moleculer";
import { OIDCProvider, ClientMetadata } from "../../src/oidc";

// Create broker
const broker = new ServiceBroker();

// Load my service
// broker.createService(OIDCProviderService);
// broker.createService(IdentityProviderService);

// Start server
broker.start().then(() => {
  const clients: ClientMetadata[] = [{
    client_id: "bar",
    redirect_uris: ["http://localhost:8080/bar"],
    response_types: ["id_token"],
    grant_types: ["implicit"],
    token_endpoint_auth_method: "none",
    logo_uri: "https://avatars2.githubusercontent.com/u/53590132?s=200&v=4",
  }];

  const oidc = new OIDCProvider({
    logger: broker.getLogger("oidc"),
    issuer: "http://localhost:8080",
    http: {
      hostname: "localhost",
      port: 8080,
    },
  }, {
    // required and should be shared between processes in production
    cookies: {
      keys: ["blabla"],
    },

    // required and should be shared between processes in production
    jwks: require("../jwks.json"),

    features: {
      devInteractions: {enabled: true},
    },
    clients,

    // required and should be shared between processes in production
    // adapter:
  });

  oidc.start();
  oidc.addClient({
    client_id: "foo",
    redirect_uris: ["http://localhost:8080/foo"],
    response_types: ["id_token"],
    grant_types: ["implicit"],
    token_endpoint_auth_method: "none",
    logo_uri: "https://avatars2.githubusercontent.com/u/53590132?s=200&v=4",
  });
});

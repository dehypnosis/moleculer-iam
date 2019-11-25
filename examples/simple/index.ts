"use strict";

import { ServiceBroker } from "moleculer";
import { ClientMetadata, createIAMServiceSchema } from "../../src";

// Create broker
const broker = new ServiceBroker({
  transporter: {
    type: "TCP",
    options: {
      udpPeriod: 1,
    },
  },
});

// Start server
broker.start().then(async () => {
  const clients: ClientMetadata[] = [{
    client_id: "bar",
    redirect_uris: ["http://localhost:8080/bar"],
    response_types: ["id_token"],
    grant_types: ["implicit"],
    token_endpoint_auth_method: "none",
    logo_uri: "https://avatars2.githubusercontent.com/u/53590132?s=200&v=4",
  }];

  const iamServiceSchema = createIAMServiceSchema({
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
  broker.createService(iamServiceSchema);
});

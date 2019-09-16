"use strict";

import { ServiceBroker } from "moleculer";
import * as GreeterService from "../../src/greeter.service";

// Create broker
const broker = new ServiceBroker();

// Load my service
broker.createService(GreeterService);

// Start server
broker.start().then(() => {

  // Call action
  broker
    .call("auth.test", {name: "John Doe"})
    .then(broker.logger.info)
    // @ts-ignore
    .catch(broker.logger.error);

});

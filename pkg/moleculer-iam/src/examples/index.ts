"use strict";

const moduleName = process.argv[2] || "memory";
process.argv.splice(2, 1);
process.env.DEBUG="oidc-provider:*";

import("./" + moduleName);

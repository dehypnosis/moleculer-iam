"use strict";

const moduleName = process.argv[2] || "simple";
process.argv.splice(2, 1);
process.env.DEBUG="oidc-provider:*";

import("./" + moduleName);

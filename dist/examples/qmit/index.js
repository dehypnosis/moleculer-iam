"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const iam_1 = require("./iam");
iam_1.broker.start()
    .then(() => {
    if (iam_1.isDebug)
        iam_1.broker.repl();
});
//# sourceMappingURL=index.js.map
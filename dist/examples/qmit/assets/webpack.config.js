"use strict";
const path = require("path");
const { webpackConfig, webpackMerge, htmlOverlay } = require("just-scripts");
const common = require("./webpack.common");
module.exports = webpackMerge(webpackConfig, htmlOverlay({
    template: "public/index.html",
}), Object.assign({}, common));
//# sourceMappingURL=webpack.config.js.map
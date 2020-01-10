"use strict";
const { webpackConfig, webpackMerge, htmlOverlay } = require("just-scripts");
const common = require("./webpack.common");
module.exports = webpackMerge(webpackConfig, htmlOverlay({
    template: "public/index.dev.html",
}), Object.assign(Object.assign({}, common), { devServer: {
        host: "localhost",
        disableHostCheck: true,
        port: 9191,
        writeToDisk: true,
        hot: true,
        contentBase: common.output.path,
    } }));
//# sourceMappingURL=webpack.serve.config.js.map
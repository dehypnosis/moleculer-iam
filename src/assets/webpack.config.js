const { webpackConfig, webpackMerge, htmlOverlay } = require('just-scripts');
const common = require("./webpack.common");

module.exports = webpackMerge(
  webpackConfig,
  htmlOverlay({
    template: 'public/index.html'
  }),
  common,
);

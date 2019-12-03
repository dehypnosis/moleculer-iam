const CopyPlugin = require("copy-webpack-plugin");
const path = require("path");

module.exports = {
  plugins: [
    new CopyPlugin([
      { from: path.resolve(__dirname, "./public"), to: path.resolve(__dirname, "../../dist/assets") },
    ]),
  ],
  output: {
    path: path.resolve(__dirname, "../../dist/assets"),
    publicPath: "/assets/",
    filename: "app.js"
  },
};

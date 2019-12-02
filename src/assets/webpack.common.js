const path = require("path");

module.exports = {
  output: {
    path: path.resolve(__dirname, "../../dist/assets"),
    publicPath: "/assets/",
    filename: "app.js"
  },
};

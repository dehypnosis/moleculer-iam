/* react-app-rewired: config-overrides.js */
const {
  removeModuleScopePlugin,
  babelInclude,
  fixBabelImports,
  override,
  overrideDevServer,
  addWebpackPlugin,
} = require("customize-cra");
const path = require("path");
const fs = require("fs");
const buildConfig = require("./build.config");


// ref: https://github.com/react-navigation/react-navigation/issues/6757#issuecomment-583319859
// shim react-navigation missing types by edit code directly
Object.entries({
  DrawerRouter: ["DrawerActionType", "DrawerNavigationState", "DrawerRouterOptions"],
  StackRouter: ["StackActionType", "StackNavigationState", "StackRouterOptions"],
  TabRouter: ["TabActionType", "TabNavigationState", "TabRouterOptions"],
}).forEach(([file, types]) => {
  const filePath = require.resolve(`@react-navigation/routers/lib/module/${file}.js`);
  const code = fs.readFileSync(filePath).toString();
  if (code.endsWith("/*shim-added*/")) return;
  fs.writeFileSync(filePath, `${code}\n${types.map(type => `export const ${type} = null;`).join("\n")}/*shim-added*/`);
});


// ref: https://github.com/arackaf/customize-cra
// ref: https://github.com/timarney/react-app-rewired
module.exports = {
  webpack: override(
    // remove module scope to include inject.ts
    removeModuleScopePlugin(),

    // define __DEV__ for some modules
    addWebpackPlugin(
      new (require("webpack").DefinePlugin)({
        __DEV__: process.env.NODE_ENV !== "production",
      }),
    ),

    // alias react-native to shimmed react-native-web module
    fixBabelImports("module-resolver", {
      alias: {
        "^react-native$": "./build.shim.rnw.tsx",
      },
    }),

    // include untranspiled modules
    babelInclude([
      path.resolve("src"),
      require.resolve("@react-navigation/stack"),
      require.resolve("react-native-screens/src/screens.web.js"),
      path.join(require.resolve("react-native-reanimated"), ".."),
      path.join(require.resolve("react-native-gesture-handler"), ".."),
      path.join(require.resolve("react-native-eva-icons"), ".."),
      require.resolve("./build.shim.rnw.tsx"),
    ]),

    // copy public assets to output path
    addWebpackPlugin(
      new (require("copy-webpack-plugin"))([
        { from: path.resolve(__dirname, "./public"), to: buildConfig.webpack.output.path },
      ]),
    ),

    // set output path from common config
    (config) => {
      return {
        ...config,
        output: {
          ...config.output,
          ...buildConfig.webpack.output,
        }
      };
    },
  ),

  // set dev server path
  devServer: overrideDevServer((config) => {
    return {
      ...config,
      open: false, // why it doesn"t work...?
      logLevel: "debug",
      writeToDisk: true,
      contentBase: buildConfig.webpack.output.path,
      contentBasePublicPath: buildConfig.webpack.output.publicPath,
    };
  }),
  paths(paths) {
    return {
      ...paths,
      appBuild: buildConfig.webpack.output.path,
    };
  },
};

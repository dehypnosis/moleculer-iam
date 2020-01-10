"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const lib_1 = require("office-ui-fabric-react/lib");
const icons_1 = require("@uifabric/icons");
tslib_1.__exportStar(require("office-ui-fabric-react/lib"), exports);
// Inject some global styles
lib_1.mergeStyles({
    selectors: {
        ":global(body), :global(html), :global(#app)": {
            margin: 0,
            padding: 0,
            height: "100%",
        },
    },
});
lib_1.loadTheme({
    palette: {
        themePrimary: "#2a44ec",
        themeLighterAlt: "#f6f7fe",
        themeLighter: "#dbdffc",
        themeLight: "#bcc4fa",
        themeTertiary: "#7c8cf4",
        themeSecondary: "#435aef",
        themeDarkAlt: "#263ed5",
        themeDark: "#2034b4",
        themeDarker: "#182685",
        neutralLighterAlt: "#f8f8f8",
        neutralLighter: "#f4f4f4",
        neutralLight: "#eaeaea",
        neutralQuaternaryAlt: "#dadada",
        neutralQuaternary: "#d0d0d0",
        neutralTertiaryAlt: "#c8c8c8",
        neutralTertiary: "#bab8b7",
        neutralSecondary: "#a3a2a0",
        neutralPrimaryAlt: "#8d8b8a",
        neutralPrimary: "#323130",
        neutralDark: "#605e5d",
        black: "#494847",
        white: "#ffffff",
        orange: "#ffa420",
    },
});
icons_1.initializeIcons();
exports.ThemeStyles = lib_1.getTheme();
//# sourceMappingURL=styles.js.map
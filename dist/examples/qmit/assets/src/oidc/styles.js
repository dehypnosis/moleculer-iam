"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const lib_1 = require("office-ui-fabric-react/lib");
const styles_1 = require("../styles");
exports.ThemeStyles = styles_1.ThemeStyles;
tslib_1.__exportStar(require("office-ui-fabric-react/lib"), exports);
exports.TextFieldStyles = {
    bold: {
        fieldGroup: {
            height: "50px",
        },
        field: {
            fontSize: lib_1.FontSizes.large,
            padding: "0 15px",
            selectors: {
                "&::placeholder": {
                    fontSize: lib_1.FontSizes.large,
                },
            },
        },
        icon: {
            lineHeight: "1.5em",
            fontSize: "1.5em",
            padding: "0.1em 0.5em",
            pointerEvents: "auto",
            userSelect: "none",
        },
    },
};
exports.DropdownStyles = {
    bold: {
        dropdown: {
            selectors: {
                ".ms-Dropdown-title": {
                    height: "48px",
                    lineHeight: "48px",
                    fontSize: lib_1.FontSizes.large,
                    padding: "0 15px",
                },
                ".ms-Dropdown-caretDownWrapper": {
                    lineHeight: "1.5em",
                    fontSize: "1.5em",
                    padding: "0.2em 0.5em",
                },
            },
        },
    },
};
exports.DatePickerStyles = {
    bold: {
        root: {
            outline: "none",
        },
        textField: {
            selectors: {
                ".ms-TextField-fieldGroup": {
                    height: "50px",
                },
                "input": {
                    padding: "0 15px",
                    height: "48px",
                    fontSize: lib_1.FontSizes.large,
                },
                "input::placeholder": {
                    fontSize: lib_1.FontSizes.large,
                },
            },
        },
        icon: {
            lineHeight: "1.5em",
            fontSize: "1.5em",
            padding: "0.5em",
        },
    },
};
// @ts-ignore
exports.LabelStyles = {
    fieldErrorMessage: {
        root: Object.assign(Object.assign({}, styles_1.ThemeStyles.fonts.small), { color: styles_1.ThemeStyles.palette.redDark, paddingBottom: 0, marginTop: "0 !important" }),
    },
};
exports.ButtonStyles = {
    large: {
        root: {
            height: "50px",
            fontSize: lib_1.FontSizes.mediumPlus,
            fontWeight: lib_1.FontWeights.light,
        },
    },
    largeThin: {
        root: {
            height: "50px",
            fontSize: lib_1.FontSizes.mediumPlus,
            fontWeight: lib_1.FontWeights.light,
        },
        label: { fontWeight: 500 },
    },
    largeFull: {
        root: {
            height: "50px",
            fontSize: lib_1.FontSizes.mediumPlus,
            fontWeight: lib_1.FontWeights.light,
            width: "100%",
        },
    },
};
//# sourceMappingURL=styles.js.map
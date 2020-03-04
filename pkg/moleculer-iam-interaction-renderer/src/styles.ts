import * as _ from "lodash";
import { loadTheme, getTheme, FontSizes, ITextFieldStyles, IStyleFunctionOrObject, FontWeights, IDatePickerStyles, IButtonStyles, IDropdownStyles, ILabelStyles, IPartialTheme } from "office-ui-fabric-react/lib";
import { ITextFieldStyleProps } from "office-ui-fabric-react/lib/components/TextField/TextField.types";
import { IDatePickerStyleProps } from "office-ui-fabric-react/lib/components/DatePicker/DatePicker.types";
import { IDropdownStyleProps } from "office-ui-fabric-react/lib/components/Dropdown/Dropdown.types";
import { initializeIcons } from "@uifabric/icons";
import { getAppOptions } from "../state";
import "./styles.css";

export * from "office-ui-fabric-react/lib";

// Inject some global styles
// mergeStyles({
//   selectors: {
//     ":global(body), :global(html), :global(#root)": {
//       margin: 0,
//       padding: 0,
//       height: "100vh",
//     },
//   },
// });

loadTheme(_.defaultsDeep(getAppOptions().theme || {}, {
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
} as IPartialTheme));

initializeIcons();

export const ThemeStyles = getTheme();

export const TextFieldStyles: { [key: string]: IStyleFunctionOrObject<ITextFieldStyleProps, ITextFieldStyles> } = {
  bold: {
    fieldGroup: {
      height: "50px",
    },
    field: {
      fontSize: FontSizes.large,
      padding: "0 15px",
      selectors: {
        "&::placeholder": {
          fontSize: FontSizes.large,
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

export const DropdownStyles: {[key: string]: IStyleFunctionOrObject<IDropdownStyleProps, IDropdownStyles>} = {
  bold: {
    dropdown: {
      selectors: {
        ".ms-Dropdown-title": {
          height: "48px",
          lineHeight: "48px",
          fontSize: FontSizes.large,
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

export const DatePickerStyles: {[key: string]: IStyleFunctionOrObject<IDatePickerStyleProps, IDatePickerStyles>} = {
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
          fontSize: FontSizes.large,
        },
        "input::placeholder": {
          fontSize: FontSizes.large,
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

export const LabelStyles: { [key: string]: ILabelStyles } = {
  fieldErrorMessage: {
    root: {
      ...ThemeStyles.fonts.small,
      color: ThemeStyles.palette.redDark,
      paddingBottom: 0,
      marginTop: "0 !important",
    },
  },
};

export const ButtonStyles: { [key: string]: IButtonStyles } = {
  large: {
    root: {
      height: "50px",
      fontSize: FontSizes.mediumPlus,
      fontWeight: FontWeights.light,
    },
  },
  largeThin: {
    root: {
      height: "50px",
      fontSize: FontSizes.mediumPlus,
      fontWeight: FontWeights.light,
    },
    label: {fontWeight: 500},
  },
  largeFull: {
    root: {
      height: "50px",
      fontSize: FontSizes.mediumPlus,
      fontWeight: FontWeights.light,
      width: "100%",
    },
  },
};

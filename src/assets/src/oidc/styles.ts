import { FontSizes, ITextFieldStyles, IStyleFunctionOrObject, FontWeights, IDatePickerStyles, IButtonStyles, AnimationStyles, IDropdownStyles, ILabelStyles } from "office-ui-fabric-react/lib";
import { ITextFieldStyleProps } from "office-ui-fabric-react/lib/components/TextField/TextField.types";
import { IDatePickerStyleProps } from "office-ui-fabric-react/lib/components/DatePicker/DatePicker.types";
import { IDropdownStyleProps } from "office-ui-fabric-react/lib/components/Dropdown/Dropdown.types";
import { ThemeStyles } from "../styles";

export * from "office-ui-fabric-react/lib";
export { ThemeStyles } ;

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

// @ts-ignore
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

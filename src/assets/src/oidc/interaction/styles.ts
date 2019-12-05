import { FontSizes, ITextFieldStyles, IStyleFunctionOrObject, FontWeights, AnimationStyles } from "office-ui-fabric-react/lib";
import { IButtonStyles } from "office-ui-fabric-react/lib/components/Button/Button.types";
import { ITextFieldStyleProps } from "office-ui-fabric-react/lib/components/TextField/TextField.types";

export { AnimationStyles };

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
};

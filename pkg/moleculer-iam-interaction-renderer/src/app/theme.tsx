import React from "react";
import { ApplicationProvider as EvaThemeProvider, IconRegistry } from "@ui-kitten/components";
import { SchemaType } from '@eva-design/dss';
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import { mapping, light, dark } from "@eva-design/eva";
import { useAppOptions } from "./options";
import "./theme.css";

// ref: https://akveo.github.io/react-native-ui-kitten/docs/guides/branding#fonts
const customMapping: SchemaType = {
  "strict": {
    "text-font-family": "'Noto Sans KR', sans-serif"
  },
  components: {},
  version: 1,
};

export const ApplicationThemeProvider: React.FunctionComponent = ({ children }) => {
  const [appOptions] = useAppOptions();
  const { theme, palette } = appOptions;
  const currentTheme = palette && theme && palette[theme] || light || dark;

  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <EvaThemeProvider
        mapping={mapping}
        customMapping={customMapping}
        theme={currentTheme}
      >
        {children}
      </EvaThemeProvider>
    </>
  )
};

import React from "react";
import { ApplicationProvider as EvaThemeProvider, IconRegistry } from "@ui-kitten/components";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import { mapping, light } from "@eva-design/eva";
import { useAppOptions } from "./options";


export const ApplicationThemeProvider: React.FunctionComponent = ({ children }) => {
  const [appOptions] = useAppOptions();
  const { theme, palette } = appOptions;
  const currentTheme = palette && theme && palette[theme] || light;

  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <EvaThemeProvider mapping={mapping} theme={currentTheme} >
        {children}
      </EvaThemeProvider>
    </>
  )
};

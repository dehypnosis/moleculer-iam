import * as _ from "lodash";
import React, { useLayoutEffect } from "react";
import { ApplicationProvider as EvaThemeProvider, IconRegistry, Layout } from "@ui-kitten/components";
import { SchemaType } from '@eva-design/dss';
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import { mapping, light, dark } from "@eva-design/eva";
import { ApplicationThemePalette } from "../../theme";
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
  const currentTheme: ApplicationThemePalette = palette && theme && palette[theme] || light || dark;

  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <EvaThemeProvider
        mapping={mapping}
        customMapping={customMapping}
        theme={currentTheme}
      >
        <Layout nativeID={"theme-container"}>
          {children}
        </Layout>
      </EvaThemeProvider>
    </>
  )
};


// to fix mobile browser 100vh mis-calculation
if (typeof window !== "undefined") {
  const fullHeightElems = window.document.querySelectorAll("#root, #theme-container, #nav-container");
  const setDocHeight = () => {
    const fullHeight = `${window.innerHeight}px`;
    fullHeightElems.forEach(elem => {
      (elem as any).style.height = fullHeight;
    });
  };

  window.addEventListener("resize", _.throttle(setDocHeight, 500));
  window.addEventListener("orientationchange", setDocHeight);
}

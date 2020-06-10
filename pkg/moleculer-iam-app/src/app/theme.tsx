import React from "react";
import { ApplicationProvider as EvaThemeProvider, IconRegistry, Layout } from "@ui-kitten/components";
import { SchemaType } from '@eva-design/dss';
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import { mapping, light, dark } from "@eva-design/eva";
import { ApplicationThemePalette } from "../../common";
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

export const AppThemeProvider: React.FunctionComponent = ({ children }) => {
  const [appOptions] = useAppOptions();
  const { theme, palette } = appOptions;
  const themePalette: ApplicationThemePalette = (palette && theme && palette[theme]) || light || dark;

  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <EvaThemeProvider
        mapping={mapping}
        customMapping={customMapping}
        theme={themePalette}
      >
        <Layout style={{height: "100%"}}>
          {children}
        </Layout>
      </EvaThemeProvider>
    </>
  )
};


/*
// to fix mobile browser 100vh mis-calculation
if (typeof window !== "undefined") {
  const fullHeightElems = window.document.querySelectorAll("#root, #theme-container, #nav-container");
  const setDocHeight = () => {
    const fullHeight = `${window.innerHeight}px`;
    fullHeightElems.forEach(elem => {
      (elem as any).style.height = fullHeight;
    });
  };

  setDocHeight();
  window.addEventListener("resize", _.throttle(setDocHeight, 500));
  window.addEventListener("orientationchange", setDocHeight);
}
*/

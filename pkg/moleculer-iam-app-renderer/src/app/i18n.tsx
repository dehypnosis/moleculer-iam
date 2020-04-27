import React from "react";
import { IntlProvider, IntlConfig, useIntl } from "react-intl";
import { useAppOptions } from "./options";

// resources
const messages: { [language: string]: IntlConfig["messages"] } = {
  get en() {
    return require("./i18n.en").default;
  },
  get ko() {
    return require("./i18n.ko").default;
  },
};

export const languages: { [language: string]: string } = {
  en: "English",
  ko: "한국어",
};

// translator
export const AppI18NProvider: React.FunctionComponent = ({ children }) => {
  const [options] = useAppOptions();
  const language = `${options.locale.language}-${options.locale.country}`;
  const selectedMessages = messages[options.locale.language] || messages.en;

  return (
    <IntlProvider locale={language} messages={selectedMessages}>
      {children}
    </IntlProvider>
  )
};

export { useIntl as useI18N };

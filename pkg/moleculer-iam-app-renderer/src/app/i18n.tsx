import React, { createContext, useContext } from "react";
import { IntlProvider, IntlConfig, useIntl } from "react-intl";
import { useAppOptions } from "./options";
import "@formatjs/intl-displaynames/polyfill";
import "@formatjs/intl-displaynames/dist/locale-data/en";
import "@formatjs/intl-displaynames/dist/locale-data/ko";
import { en } from "./i18n.en";
import { ko } from "./i18n.ko";

// resources
const messages: {[language: string]: IntlConfig["messages"]} = {
  en,
  ko,
};


// translator
export const AppI18NProvider: React.FunctionComponent = ({ children }) => {
  const [options] = useAppOptions();
  const locale = `${options.locale.language}-${options.locale.country}`;
  const selectedMessages = messages[options.locale.language as keyof typeof messages] || messages.en;

  return (
    <IntlProvider locale={locale} messages={selectedMessages}>
      {children}
    </IntlProvider>
  )
};

// language names
const appLanguages: {[language: string]: { of: (locale: string) => string}} = {};
for (const language of Object.keys(messages)) {
  appLanguages[language] = Intl && (Intl as any).DisplayNames ? (
    new (Intl as any).DisplayNames([language], {
      type: "language",
      style: "narrow",
      fallback: "code",
    })
  ) : (
    {
      of: () => language,
    }
  )
}

export const AppLanguagesContext = createContext(appLanguages);

export function useAppLanguages() {
  return useContext(AppLanguagesContext);
}

export { useIntl as useI18N };

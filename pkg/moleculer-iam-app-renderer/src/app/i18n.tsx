import React from "react";
import { IntlProvider, IntlConfig, useIntl } from "react-intl";
import { useAppOptions } from "../hook";
import "@formatjs/intl-displaynames/polyfill";
import "@formatjs/intl-displaynames/dist/locale-data/en";
import "@formatjs/intl-displaynames/dist/locale-data/ko";
import { en } from "./i18n.en";
import { ko } from "./i18n.ko";

const messages: {[language: string]: IntlConfig["messages"]} = {
  en,
  ko,
};

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

export const supportedLanguages: {[language: string]: { of: (locale: string) => string}} = {};
for (const language of Object.keys(messages)) {
  supportedLanguages[language] = Intl && (Intl as any).DisplayNames ? (
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
};

export { useIntl as useI18N };

import React from "react";
// ref: https://formatjs.io/docs/react-intl
import { IntlProvider, IntlConfig, IntlContext as AppI18NContext, useIntl as useAppI18N } from "react-intl";
import { flatten } from "flat";
import { useAppOptions } from "./options";

// resources, later, use proxy or not
const messagesCache = new Map<any, any>();
const messages: { [language: string]: IntlConfig["messages"] } = {
  get en() {
    if (!messagesCache.has("en")) {
      messagesCache.set("en", flatten(require("./i18n.en").default) as any)
    }
    return messagesCache.get("en");
  },
  get ko() {
    if (!messagesCache.has("ko")) {
      messagesCache.set("ko", flatten(require("./i18n.ko").default) as any)
    }
    return messagesCache.get("ko");
  },
};

export const languages: { [language: string]: string } = {
  en: "English",
  ko: "한국어",
};

// translator
export const AppI18NProvider: React.FunctionComponent = ({ children }) => {
  const [options] = useAppOptions();
  const language = `${options.locale.language}-${options.locale.region}`;
  const selectedMessages = messages[options.locale.language] || messages.en;

  return (
    <IntlProvider locale={language} messages={selectedMessages}>
      {children}
    </IntlProvider>
  )
};

export { useAppI18N, AppI18NContext };

// post-processors
// 종성이 있으면 첫째 조사 없으면 둘째 조사
const processKoreanJosaPatterns = {
  "을/를": ["을", "를"],
  "이/가": ["이", "가"],
  "와/과": ["과", "와"],
  "은/는": ["은", "는"],
};

export const postProcessKoreanJosa = (message: string) => {
  for (const [pattern, josas] of Object.entries(processKoreanJosaPatterns)) {
    const tokens = message.split(pattern).filter(t => !!t);
    const lastToken = tokens.pop();
    if (tokens.length === 0) {
      continue;
    }
    let tmp = "";
    for (const token of tokens) {
      const charCode = token.charCodeAt(token.length - 1);
      tmp += token;
      tmp += (charCode - 0xac00) % 28 > 0 ? josas[0] : josas[1];
    }
    message = tmp + lastToken;
  }

  return message;
};

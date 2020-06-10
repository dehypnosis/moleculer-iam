import * as _ from "lodash";
import { ParsedLocale } from "moleculer-iam";
import React, { createContext, useContext } from "react";
import { darkTheme, lightTheme } from "./theme.palette";
import { ApplicationOptions } from "../../common";

type AppOptions = ApplicationOptions & { dev: boolean, locale: ParsedLocale };

export const AppOptionsContext = createContext<[AppOptions, AppOptionsProvider["setState"]]>([] as any);

export function useAppOptions() {
  return useContext(AppOptionsContext);
}

export class AppOptionsProvider extends React.Component<{initialOptions: Partial<AppOptions>}, AppOptions> {
  public static defaultOptions: AppOptions = {
    logo: {
      uri: null,
      align: "flex-start",
      height: "50px",
      width: "92px",
    },
    login: {
      federationOptionsVisible: false,
    },
    register: {
      skipDetailClaims: false,
      skipEmailVerification: false,
      skipPhoneVerification: false,
    },
    theme: "light",
    palette: {
      light: lightTheme,
      dark: darkTheme,
    },
    dev: false,
    locale: {
      language: "ko",
      region: "KR",
    },
  };

  state = _.defaultsDeep(this.props.initialOptions || {}, AppOptionsProvider.defaultOptions);

  constructor(props: any) {
    super(props);

    // apply new theme from query string
    const theme = (window.location.search.substr(1).split("&").find(x => x.startsWith("theme=")) || "").split("=")[1] // query first
      || (document.cookie.split("; ").find(s => s.trim().startsWith("theme=")) || "").split("=")[1]  // cookie second
    if (theme && theme !== this.state.theme && Object.keys(this.state.palette).includes(theme)) {
      this.state.theme = theme;
    }
    console.debug("app theme cookie update:", this.state.theme);
    document.cookie = `theme=${this.state.theme}; path=/`; // store as session cookie
  }

  private readonly _setState = this.setState.bind(this);

  render() {
    console.debug("app options update:", this.state);

    if (this.state.dev) {
      // @ts-ignore
      window.__APP_DEV__ = {
        options: this.state,
        setOptions: this._setState,
      };
    }

    // store locale, theme in the cookie
    // locale cookie is supported by moleculer-iam server itself
    const locale = `${this.state.locale.language || "ko"}-${this.state.locale.region || "KR"}`;
    document.cookie = `locale=${locale}; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT`;

    return (
      <AppOptionsContext.Provider value={[this.state, this._setState]}>
        {this.props.children}
      </AppOptionsContext.Provider>
    )
  }
}

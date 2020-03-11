import * as _ from "lodash";
import { ParsedLocale } from "moleculer-iam";
import React, { createContext, useContext } from "react";
import { getAppDev, getAppOptions, getInitialAppState } from "../../client";
import { ApplicationOptions } from "../../common";
import { darkTheme, lightTheme } from "./theme.palette";

type AppOptions = ApplicationOptions & { dev: boolean, locale: ParsedLocale };

export const AppOptionsContext = createContext<[AppOptions, AppOptionsProvider["setState"]]>([] as any);

export function useAppOptions() {
  return useContext(AppOptionsContext);
}

export class AppOptionsProvider extends React.Component<{}, AppOptions> {
  state = _.defaultsDeep({
    ...getAppOptions(),
    dev: getAppDev(),
    locale: getInitialAppState().locale,
  }, {
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
  } as ApplicationOptions);

  componentWillMount() {
    // apply new theme from query string
    const theme = (window.location.search.substr(1).split("&").find(x => x.startsWith("theme=")) || "").split("=")[1] // query first
      || (document.cookie.split("; ").find(s => s.trim().startsWith("theme=")) || "").split("=")[1]  // cookie second
    if (theme && theme !== this.state.theme && Object.keys(this.state.palette).includes(theme)) {
      console.debug("app theme options from querystring/cookie:", theme);
      document.cookie = `theme=${theme}; path=/`; // as session cookie
      this.setState({ theme });
    }
  }

  render() {
    console.debug("app options update:", this.state);
    // store locale, theme in the cookie
    // locale cookie is supported by moleculer-iam server itself
    const locale = `${this.state.locale.language || "ko"}-${this.state.locale.country || "KR"}`;
    document.cookie = `locale=${locale}; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT`;

    return (
      <AppOptionsContext.Provider value={[this.state, this.setState.bind(this)]}>
        {this.props.children}
      </AppOptionsContext.Provider>
    )
  }
}

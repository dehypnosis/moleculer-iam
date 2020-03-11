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

  render() {
    console.debug("app options update:", this.state);
    // set locale cookie
    const locale = `${this.state.locale.language || "ko"}-${this.state.locale.country || "KR"}`;
    document.cookie = `locale=${locale}; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT`;

    return (
      <AppOptionsContext.Provider value={[this.state, this.setState.bind(this)]}>
        {this.props.children}
      </AppOptionsContext.Provider>
    )
  }
}

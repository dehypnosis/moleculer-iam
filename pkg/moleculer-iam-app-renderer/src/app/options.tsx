import * as _ from "lodash";
import React, { createContext, useContext } from "react";
import { ApplicationOptions, getAppDev, getAppOptions } from "../../inject";
import { darkTheme, lightTheme } from "../../theme";

export const AppOptionsContext = createContext<[ApplicationOptions & { dev: boolean }, AppOptionsProvider["setState"]]>([] as any);

export function useAppOptions() {
  return useContext(AppOptionsContext);
}

export class AppOptionsProvider extends React.Component<{}, ApplicationOptions & { dev: boolean }> {
  state = _.defaultsDeep({
    ...getAppOptions(),
    dev: getAppDev(),
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

    return (
      <AppOptionsContext.Provider value={[this.state, this.setState.bind(this)]}>
        {this.props.children}
      </AppOptionsContext.Provider>
    )
  }
}

import * as _ from "lodash";
import React, { createContext, useContext } from "react";
import { ApplicationOptions, getAppDev, getAppOptions } from "../../inject";

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
      align: "left",
    },
    login: {
      federationOptionsVisibleDefault: false,
    },
    theme: {

    },
  } as ApplicationOptions);

  componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<ApplicationOptions & { dev: boolean }>, snapshot?: any): void {
    console.log(prevState);
  }

  render() {
    return (
      <AppOptionsContext.Provider value={[this.state, this.setState.bind(this)]}>
        {this.props.children}
      </AppOptionsContext.Provider>
    )
  }
}

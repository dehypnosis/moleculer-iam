// import * as _ from "lodash";
import { LinkingOptions } from "@react-navigation/native/lib/typescript/src/types";
import React, { useCallback, useLayoutEffect, useState } from "react";
import { getStateFromPath as getNavStateFromPath, NavigationContainerRef, useNavigation as useOriginalNavigation } from "@react-navigation/core";
import { NavigationContainer, useLinking, useRoute } from "@react-navigation/native";
import { View } from "react-native";
import { useAppState } from "./state";

const navigationContainerRef = React.createRef<NavigationContainerRef>();

export const AppNavigationProvider: React.FunctionComponent<{
  routeConfig: NonNullable<LinkingOptions["config"]>;
}> = ({routeConfig, children}) => {
  const [appState] = useAppState();

  // link nav state with URL
  const deepLinking = useLinking(navigationContainerRef, {
    prefixes: [window.location.origin],
    config: routeConfig,
    getStateFromPath: useCallback((path, options) => {
      const navState = getNavStateFromPath(path, options);
      if (navState) {
        // show error route on server error
        if (appState.error) {
          navState.routes[0].name = "error.index";
          console.error(`appState.error`, appState);
        }
        console.debug("nav state update:", navState);
      }
      return navState;
    }, [appState]),
  });

  // load initial nav state
  const [initialState, setInitialState] = useState(null as any);
  const [loading, setLoading] = useState(true);
  useLayoutEffect(() => {
      deepLinking
        .getInitialState()
        .then(nav => setInitialState(nav), err => console.error(err))
        .then(() => setLoading(false));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []);

  if (loading) {
    return null;
  }

  return (
    <NavigationContainer
      initialState={initialState}
      ref={navigationContainerRef}
    >
      <View nativeID={"nav-container"} style={{alignSelf: "center"}}>{children}</View>
    </NavigationContainer>
  );
};

// enhance navigation instance methods
export function useNavigation() {
  // set undefined params as empty object
  const route = useRoute() as ReturnType<typeof useRoute> & { params: { [key: string]: any } };
  if (!route.params) {
    route.params = {};
  }

  // override nav methods to fix bug which not update existing route's query params
  const nav = useOriginalNavigation();
  const navigate = nav.navigate;
  // @ts-ignore
  if (!navigate.__enhanced) {
    nav.navigate = (...args: any[]) => {
      if (typeof args[0] === "string" && typeof args[1] === "object" && args[1] !== null) {
        const [routeName, params] = args;
        const oldRoute = nav.dangerouslyGetState().routes.find(r => r.name === routeName);
        if (oldRoute) {
          setTimeout(() => {
            console.debug("set params for: ", oldRoute.key, params);
            nav.dispatch({
              type: "SET_PARAMS",
              payload: { params },
              source: oldRoute.key,
            });
          }, 100);
        }
      }
      return navigate(...args as any);
    };
    // @ts-ignore
    nav.navigate.__enhanced = true;
  }

  // for dev
  // @ts-ignore
  if (window.__APP_DEV__) {
    // @ts-ignore
    window.__APP_DEV__.nav = nav;
  }
  return {nav, route};
}


import React, { useCallback, useEffect, useRef, useState } from "react";
import { getStateFromPath as getNavStateFromPath, NavigationContainerRef } from "@react-navigation/core";
import { NavigationContainer, NavigationState, Route, useLinking } from "@react-navigation/native";
import { AppNavigator, routeConfig } from "./nav";
import { useAppState, getAppOptions } from "../hook";
import { LoadingScreen } from "../screen/loading";

const { dev } = getAppOptions();

export const AppNavigationContainer: React.FunctionComponent = ({ children }) => {
  const [appState] = useAppState();

  // link nav state with URL
  const ref = useRef<NavigationContainerRef>();
  const deepLinking = useLinking(ref, {
    prefixes: [window.location.origin],
    config: routeConfig,
    getStateFromPath: useCallback((path, options) => {
      const navState = getNavStateFromPath(path, options);
      if (navState) {
        // show error route on server error
        if (appState.error) {
          navState.routes[0].name = "error";
          console.error(`appState.error`, appState);
        }

        // warn unmatched interaction page
        if (appState.name) {
          const route = getMatchedRoute(navState);
          if (route && route.name !== appState.name) {
            console.warn(`appState.interaction differs from matched route`, appState.name, route);
          }
        }
      }
      dev && console.debug("get nav state from URL", navState);
      return navState;
    }, [appState]),
  });

  // load initial nav state
  const [initialState, setInitialState] = useState(null as any);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    deepLinking
      .getInitialState()
      .then(nav => setInitialState(nav), err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer
      initialState={initialState}
      ref={ref}
    >
      <AppNavigator loading={loading} />
    </NavigationContainer>
  )
}

function getMatchedRoute(state: Partial<NavigationState>): Route<string> & {state?: Partial<NavigationState>} | undefined {
  const route = state.routes && state.routes[0];
  if (!route) return;
  if (route.state) {
    return getMatchedRoute(route.state);
  }
  return route;
}

import { LinkingOptions } from "@react-navigation/native/lib/typescript/src/types";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { getStateFromPath as getNavStateFromPath, NavigationContainerRef, useNavigation as useOriginalNavigation } from "@react-navigation/core";
import { NavigationContainer, NavigationState, Route, useLinking, useRoute } from "@react-navigation/native";
import { useAppState } from "./state";

export const AppNavigationProvider: React.FunctionComponent<{
  routeConfig: NonNullable<LinkingOptions["config"]>;
}> = ({ routeConfig, children }) => {
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
            console.warn(`appState.name differs from matched route`, appState.name, route);
          }
        }
      }
      console.debug("nav state update:", navState);
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
    return null;
  }

  return (
    <NavigationContainer
      initialState={initialState}
      ref={ref}
    >
      {children}
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


// enhance navigation instance methods
export function useNavigation() {
  // set undefined params as empty object
  const route = useRoute() as ReturnType<typeof useRoute> & { params: {[key: string]: any} };
  if (!route.params) route.params = {};

  // override nav methods to include locale query for navigation
  const nav = useOriginalNavigation();
  const navigate = nav.navigate;
  nav.navigate = (...args: any[]) => {
    includeLocaleQuery(args, route);
    return navigate(...args as any);
  };

  return { nav, route };
}

function includeLocaleQuery(args: any, route: any) {
  if (route.params.locale) {
    if (!args[1] || !args[1].params || !args[1].params.locale) {
      if (!args[1]) {
        args[1] = {};
      }
      if (!args[1].params) {
        args[1].params = {};
      }
      args[1].params.locale = route.params.locale;
    }
  }
}

import { LinkingOptions } from "@react-navigation/native/lib/typescript/src/types";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { getStateFromPath as getNavStateFromPath, NavigationContainerRef, useNavigation as useOriginalNavigation } from "@react-navigation/core";
import { NavigationContainer, useLinking, useRoute } from "@react-navigation/native";
import { View } from "react-native";
import { useAppOptions } from "../hook";
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
        console.debug("nav state update:", navState);
      }
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
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
    []);

  if (loading) {
    return null;
  }

  return (
    <NavigationContainer
      initialState={initialState}
      ref={ref}
    >
      <View nativeID={"nav-container"} style={{alignSelf: "center"}}>{children}</View>
    </NavigationContainer>
  )
};

// enhance navigation instance methods
export function useNavigation() {
  // set undefined params as empty object
  const route = useRoute() as ReturnType<typeof useRoute> & { params: {[key: string]: any} };

  // override nav methods to include locale query for navigation
  const nav = useOriginalNavigation();
  const navigate = nav.navigate;
  // @ts-ignore
  if (!navigate.__enhanced) {
    nav.navigate = (...args: any[]) => {
      includeLocaleQuery(args, route);
      navigate(...args as any);

      // call navigate twice as a workaround to fix a bug which does not update existing screen's params
      if (args[1] && args[1].screen && nav.dangerouslyGetState().routes.every(r => r.name !== args[1].screen)) {
        navigate(...args as any);
      }
    };
    // @ts-ignore
    nav.navigate.__enhanced = true;
  }

  const [appOptions] = useAppOptions();
  if (appOptions.dev) {
    // @ts-ignore
    window.__APP_DEV__.nav = nav;
  }

  if (!route.params) route.params = {};
  return { nav, route };
}

function includeLocaleQuery(args: any, route: any) {
  if (route.params && route.params.locale) {
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

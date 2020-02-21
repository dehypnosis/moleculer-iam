import React, { useEffect, useRef, useState } from "react";
import { getStateFromPath, NavigationContainer, useLinking } from "@react-navigation/native";
import { Navigator, routeConfig } from "./navigator";
import { useServerState } from "./hook";

export const App: React.FunctionComponent = () => {
  // read state from URI
  const ref = useRef();
  const serverState = useServerState();
  const { getInitialState } = useLinking(ref, {
    prefixes: [window.location.origin],
    config: routeConfig,
    getStateFromPath: (path, options) => {
      const state = getStateFromPath(path, options);
      if (state && state.routes[0]) {
        const route = state.routes[0];
        if (serverState.error) {
          // route.name = "error";
          console.error(`serverState.error`, serverState);
        }
        if (serverState.interaction && !route.name.startsWith(serverState.interaction.name)) {
          console.warn(`serverState.interaction differs from matched route`, serverState.interaction, route);
        }
      }
      return state;
    },
  });

  const [loading, setLoading] = useState(true);
  const [initialState, setInitialState] = useState();
  useEffect(() => {
    (async () => {
      let state;
      try {
        state = await getInitialState();
        setInitialState(state);
        console.debug("initial state loaded from uri", state);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [getInitialState]);

  if (loading) {
    return null;
  }

  return (
    <NavigationContainer
      initialState={initialState}
      ref={ref}
    >
      <Navigator />
    </NavigationContainer>
  );
};

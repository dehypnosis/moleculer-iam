import React, { useEffect, useRef, useState } from "react";
import { NavigationContainer, useLinking } from "@react-navigation/native";
import { Navigator, routeConfig } from "./navigator";

export const App: React.FunctionComponent = () => {
  // read state from URI
  const ref = useRef();
  const { getInitialState } = useLinking(ref, {
    prefixes: [window.location.origin],
    config: routeConfig,
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
